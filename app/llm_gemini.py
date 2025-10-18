import google.generativeai as genai
from typing import Dict
import os

# Make sure to set your API key
API_KEY = os.environ.get("GOOGLE_API_KEY")
genai.configure(api_key=API_KEY)

GEMINI_MODEL = os.environ.get("GEMINI_MODEL")  # or your desired model

def call_gemini(prompt: str, temperature: float = 0.0, max_tokens: int = 512) -> Dict:
    """
    Call Google Gemini model using the official Python SDK.
    Returns a dict with 'text' and 'raw' response.
    """
    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = model.generate_content(
            prompt,
            # temperature=temperature,
            # max_output_tokens=max_tokens
        )

        # Extract text
        text = getattr(response, "text", None)
        return {"text": text, "raw": response}

    except Exception as e:
        print("❌ Error calling Gemini:", e)
        return {"text": None, "raw": None}
