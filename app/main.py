# main.py
from fastapi import FastAPI, HTTPException, File, UploadFile
from .schemas import UploadResponse, ChatRequest
from typing import List
from .ingest import ingest_file
from pathlib import Path
from .embeddings import embed_texts
from .retriever import retrieve
from .pinecone_client import init_pinecone, get_index
from .llm_gemini import call_gemini
import os
from app.ingest import chunk_text, read_file
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="MediAssist RAG")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# initialize pinecone at startup
@app.on_event("startup")
def startup_event():
    init_pinecone()
    # validate index exists
    try:
        get_index()
    except Exception as e:
        # Informative error: index must exist and have correct dimension
        print("Pinecone index check failed:", str(e))

@app.post("/upload", response_model=List[UploadResponse])
async def upload_documents(files: List[UploadFile] = File(...)):
    """
    Upload multiple .txt, .docx, or .pdf files and ingest them into Pinecone.
    """
    upload_dir = Path("data")
    upload_dir.mkdir(exist_ok=True)
    
    responses = []

    for file in files:
        file_path = upload_dir / file.filename
        try:
            # Save file temporarily
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)

            # Ingest file
            ingest_file(str(file_path))

            # Count number of chunks ingested
            text_content = read_file(str(file_path))
            num_chunks = len(chunk_text(text_content))

            responses.append(UploadResponse(
                filename=file.filename,
                chunks_uploaded=num_chunks,
                message="File successfully ingested."
            ))

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing {file.filename}: {str(e)}")

    return responses


@app.post("/chat")
def chat(req: ChatRequest):
    if not req.question:
        raise HTTPException(status_code=400, detail="question required")

    # 1. embed
    q_vec = embed_texts([req.question])[0]

    # 2. retrieve
    matches = retrieve(q_vec, top_k=req.top_k or 5)

    # 3. build context snippets
    snippets = []
    for i, m in enumerate(matches):
        meta = m.get("metadata", {})
        src = meta.get("source", "unknown")
        chunk_text = meta.get("text", "")
        chunk_index = meta.get("chunk_index", "n/a")
        snippets.append(f"[{i+1}] Source: {src} | chunk_index: {chunk_index}\n{chunk_text}\n")

    # 4. build prompt
    role = req.role or "doctor"
    system_preamble = (
        "You are a medical assistant. Use only the provided source snippets for factual claims. "
        "When you state a clinical fact, include a bracketed citation to the snippet number(s). "
        "If information is not supported by the snippets, say you cannot confirm and suggest consulting official guidelines or a clinician."
    )

    snippet_block = "\n---\n".join(snippets) if snippets else ""
    prompt = (
        f"{system_preamble}\nUser role: {role}\nQuestion: {req.question}\n\n"
        f"Retrieved snippets (most relevant first):\n{snippet_block}\n\n"
        "Instructions: Provide (1) short answer (2-3 sentences) with citations like [1], [2]; "
        "(2) a short plain-language explanation; (3) list of snippet citations used.\n"
    )

    # 5. call Gemini
    llm_resp = call_gemini(prompt, temperature=0.0, max_tokens=512)
    
    # Return only plain Python types
    return {
        "answer": llm_resp["text"],
        # "raw_llm": llm_resp["raw"],
        "retrieved": matches
    }
