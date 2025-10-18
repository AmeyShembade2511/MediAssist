# utils.py
from typing import List
import re
from dotenv import load_dotenv
load_dotenv()

def simple_chunk_text(text: str, chunk_size: int = 800, overlap: int = 100) -> List[str]:
    """
    Naive chunker splitting on paragraphs, fallback to character-based splitting.
    chunk_size and overlap measured in approximate tokens/characters (coarse).
    """
    paragraphs = [p.strip() for p in re.split(r'\n{2,}', text) if p.strip()]
    chunks = []
    cur = ""
    for p in paragraphs:
        if len(cur) + len(p) <= chunk_size:
            cur = (cur + "\n\n" + p).strip() if cur else p
        else:
            if cur:
                chunks.append(cur)
            # if paragraph itself too long, break it
            if len(p) > chunk_size:
                for i in range(0, len(p), chunk_size - overlap):
                    chunks.append(p[i:i + chunk_size])
                cur = ""
            else:
                cur = p
    if cur:
        chunks.append(cur)
    # add overlap
    final_chunks = []
    for i, c in enumerate(chunks):
        final_chunks.append(c)
        # create overlapping snippet with next
        if i + 1 < len(chunks) and overlap > 0:
            overlap_text = (c + " " + chunks[i + 1])[-overlap:]
            if overlap_text and overlap_text not in final_chunks:
                final_chunks.append(overlap_text)
    return final_chunks
