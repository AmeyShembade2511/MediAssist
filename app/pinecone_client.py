import os
from pinecone import Pinecone, ServerlessSpec  # Only these

PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
INDEX_NAME = os.environ.get("PINECONE_INDEX", "mediassist")
REGION = os.environ.get("PINECONE_REGION", "us-west1-gcp")  # change to your region

pc: Pinecone = None
index_handle = None  # Will hold the Index object


def init_pinecone():
    """
    Initialize Pinecone client and index.
    """
    global pc, index_handle
    if not PINECONE_API_KEY:
        raise RuntimeError("PINECONE_API_KEY not set")

    # Create Pinecone client
    pc = Pinecone(api_key=PINECONE_API_KEY)

    # Check if index exists
    existing_indexes = [i.name for i in pc.list_indexes()]
    if INDEX_NAME not in existing_indexes:
        print(f"Creating Pinecone index '{INDEX_NAME}'...")
        pc.create_index(
            name=INDEX_NAME,
            dimension=384,  # match your embedding model
            metric="cosine",
            spec=ServerlessSpec(cloud="gcp", region=REGION)
        )

    # Create Index handle
    index_handle = pc.Index(INDEX_NAME)
    print(f"Pinecone index '{INDEX_NAME}' ready.")


def get_index():
    """
    Return the Pinecone Index object.
    """
    global index_handle
    if index_handle is None:
        raise RuntimeError("Pinecone index not initialized. Call init_pinecone() first.")
    return index_handle


def upsert_chunks(chunks):
    """
    Upsert a list of vectors to Pinecone.
    chunks: List of dicts {id: str, vector: List[float], metadata: dict}
    """
    idx = get_index()
    vectors_to_upsert = [(c["id"], c["vector"], c["metadata"]) for c in chunks]
    idx.upsert(vectors=vectors_to_upsert)


def query_vectors(vector, top_k=5, include_metadata=True):
    """
    Query Pinecone index.
    """
    idx = get_index()
    return idx.query(vector=vector, top_k=top_k, include_metadata=include_metadata)
