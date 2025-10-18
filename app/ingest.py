import os
from typing import List
from pathlib import Path
import uuid
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter

from app.pinecone_client import upsert_chunks

# Initialize HuggingFace embeddings
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
embedder = SentenceTransformer(EMBEDDING_MODEL)


def read_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


def read_docx(file_path: str) -> str:
    import docx
    doc = docx.Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])


def read_pdf(file_path: str) -> str:
    import fitz  # PyMuPDF
    text = []
    with fitz.open(file_path) as pdf:
        for page in pdf:
            text.append(page.get_text())
    return "\n".join(text)


def read_file(file_path: str) -> str:
    ext = Path(file_path).suffix.lower()
    if ext == ".txt":
        return read_txt(file_path)
    elif ext == ".docx":
        return read_docx(file_path)
    elif ext == ".pdf":
        return read_pdf(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")


def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> List[str]:
    """
    Split text into chunks for embeddings
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    return splitter.split_text(text)


def ingest_file(file_path: str):
    """
    Ingest a single document to Pinecone with unique IDs
    """
    print(f"Ingesting {file_path}...")
    content = read_file(file_path)
    chunks = chunk_text(content)

    # Create embeddings and metadata
    embeddings_data = []
    for i, chunk in enumerate(chunks):
        vector = embedder.encode(chunk).tolist()
        unique_id = f"{Path(file_path).stem}_{i}_{uuid.uuid4().hex}"  # unique ID
        embeddings_data.append({
            "id": unique_id,
            "vector": vector,
            "metadata": {"source": str(file_path), "text": chunk}
        })

    # Upsert into Pinecone
    upsert_chunks(embeddings_data)
    print(f"Finished ingesting {file_path}, {len(chunks)} chunks uploaded.")


def ingest_folder(folder_path: str):
    """
    Ingest all supported files in a folder
    """
    folder = Path(folder_path)
    for file_path in folder.iterdir():
        if file_path.suffix.lower() in [".txt", ".docx", ".pdf"]:
            ingest_file(str(file_path))
