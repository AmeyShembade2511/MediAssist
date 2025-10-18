import requests
import io

url = "http://127.0.0.1:8000/upload"

with open("document.txt", "rb") as f:
    file_bytes = f.read()

files = {"file": ("document.txt", io.BytesIO(file_bytes))}
response = requests.post(url, files=files)

print(response.json())
