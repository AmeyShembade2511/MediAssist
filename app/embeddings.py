# embeddings.py
from sentence_transformers import SentenceTransformer
import os
import numpy as np
from dotenv import load_dotenv
load_dotenv()

_model = None

def get_model():
    global _model
    if _model is None:
        model_name = os.environ.get("HF_EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
        _model = SentenceTransformer(model_name)
    return _model

def embed_texts(texts):
    """
    texts: list[str]
    returns: list[list[float]]
    """
    model = get_model()
    embs = model.encode(texts, show_progress_bar=False, convert_to_numpy=True)
    # Ensure float32 list (Pinecone expects floats)
    return [emb.astype(float).tolist() for emb in embs]
