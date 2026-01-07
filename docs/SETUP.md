# DocMind AI Setup Guide

## 🚀 Quick Setup (Docker)

The easiest way to run DocMind AI is using Docker Compose.

### 1. Prerequisites
- Docker Desktop installed
- OpenAI API Key

### 2. Configuration
Create a `.env` file in the **root directory**:

```ini
# Required
OPENAI_API_KEY=sk-your-key-here

# Optional: For Local Llama 3 (Ollama)
LLM_PROVIDER=openai  # or ollama
OLLAMA_BASE_URL=http://host.docker.internal:11434
OLLAMA_MODEL=llama3
OLLAMA_EMBED_MODEL=mxbai-embed-large
```

### 3. Start Services
Run this command in the root folder:

```bash
docker-compose up -d --build
```
This starts:
- **Backend API**: `http://localhost:8000`
- **ChromaDB**: `http://localhost:8001`

### 4. Start Frontend
The frontend runs locally for easier development:

```bash
cd frontend
npm install
npm run dev
```
Access the UI at: **`http://localhost:3000`**

---

## 🛠️ Manual Setup (Dev Mode)

If you want to run the backend manually (without Docker):

1. **Start ChromaDB only**:
   ```bash
   docker-compose up -d chromadb
   ```

2. **Run Backend**:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate   # or source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```
