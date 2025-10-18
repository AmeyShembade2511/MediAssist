# retriever.py
from .pinecone_client import query_vectors
from typing import List, Dict, Any
from dotenv import load_dotenv
load_dotenv()

def retrieve(query_vector, top_k=5, filter_metadata: dict = None):
    """
    query_vector: list[float]
    filter_metadata: optional dict to filter by metadata (Pinecone metadata_filter)
    """
    # Pinecone supports metadata_filter param in query
    idx = query_vectors(query_vector, top_k=top_k, include_metadata=True)
    # resp format: matches list with id, score, metadata
    matches = []
    for m in idx.get("matches", idx.matches if hasattr(idx, "matches") else []):
        # compat across pinecone client versions
        meta = m.get("metadata", getattr(m, "metadata", {}))
        matches.append({
            "id": m.get("id", getattr(m, "id", None)),
            "score": m.get("score", getattr(m, "score", None)),
            "metadata": meta
        })
    return matches
