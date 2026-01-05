# DocMind AI (Hybrid RAG)

## Setup Instructions

### 1. Environment Variables
Create a file `backend/.env` with your keys:
```
OPENAI_API_KEY=sk-...
CHROMA_URL=http://localhost:8001
```

### 2. Backend (Python)
Ensure Python 3.10+ is installed.
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

### 4. Vector Database (Docker)
```bash
docker-compose up -d
```
