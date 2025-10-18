# schemas.py
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv
load_dotenv()

class UploadResponse(BaseModel):
    filename: str
    chunks_uploaded: int
    message: str

class ChatRequest(BaseModel):
    question: str
    role: Optional[str] = "doctor"  # patient, student, doctor
    top_k: Optional[int] = 5
