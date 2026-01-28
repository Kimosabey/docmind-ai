# 🚀 Getting Started with DocMind AI

> **Prerequisites**
> *   **Docker Desktop** (Engine + Compose)
> *   **OpenAI API Key** (Required for Cloud Mode)
> *   *(Optional)* **Ollama** running locally for Privacy Mode

## 1. Environment Setup

**Required Variables (`.env`)**
Create a `.env` file in the project root:
```ini
OPENAI_API_KEY=sk-your-actual-key-here
LLM_PROVIDER=openai 
# Options: 'openai' or 'ollama'
```

---

## 2. Installation & Launch

### Step 1: Start Backend (FastAPI + ChromaDB)
We utilize Docker for the backend services to ensure a consistent Python/Database environment.

```bash
docker-compose up -d --build
```
*Wait ~10s for ChromaDB to initialize on port 8001.*

### Step 2: Start Frontend (Next.js)
We run the frontend locally for the best developer experience (HMR).

```bash
cd frontend
npm install
npm run dev
```

---

## 3. Usage Guide

### A. Access Interface
Go to **`http://localhost:3000`**.

### B. Ingest a Document
1.  Click **"Upload PDF"** in the sidebar.
2.  Select a sample document (e.g., a Resume or Handbook).
3.  Watch the "Neural Inspector" count increase as chunks are indexed.

### C. Ask Questions
Type in the chat box: *"Summarize the document for me."*

### D. Switch "Brains" (Cloud vs Local)
1.  Stop the docker container.
2.  Edit `.env` -> set `LLM_PROVIDER=ollama`.
3.  Restart. (Requires Ollama running on host).

---

## 4. Running Tests

### Backend Tests
```bash
docker exec -it docmind-api pytest
```

### Manual API Test
Open the Swagger UI at **`http://localhost:8000/docs`** to test endpoints directly.
*   **POST /ingest**: Upload a file.
*   **POST /chat**: Send a query.
