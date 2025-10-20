MediAssist — RAG medical assistant (demo)

This workspace contains a simple demo implementation of a Retrieval-Augmented Generation (RAG) medical assistant with an Express backend and React frontend.

Folders:
- backend/: Express API and simple in-memory index
- frontend/: React UI

Run:
- Start backend: cd backend && npm install && npm run dev or npm start
- Start frontend: cd frontend && npm install && npm start
- Start FASTApi Server: python -m venv venv && venv\Scripts\activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

