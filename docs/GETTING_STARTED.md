# Getting Started: DocMind AI

> Instructions for deploying the Hybrid RAG platform locally.

---

## 1. Prerequisites

*   **Docker Desktop**: Required for the API and Vector DB services.
*   **Node.js**: v18+ for the Next.js frontend.
*   **OpenAI API Key**: Required if using Cloud mode.
*   **Ollama**: (Optional) For running models locally on your GPU/CPU.

---

## 2. Installation

### Setup Backend
```bash
# Start Docker services (FastAPI + ChromaDB)
docker-compose up -d --build
```

### Setup Frontend
```bash
cd frontend
npm install
```

---

## 3. Environment Variables

Create a root `.env` file to configure the LLM provider.

| Variable | Default | Description |
| :--- | :--- | :--- |
| `OPENAI_API_KEY` | `N/A` | Your OpenAI secret key. |
| `LLM_PROVIDER` | `openai` | Set to `openai` or `ollama`. |
| `CHROMA_PORT` | `8001` | Port for the vector database. |

---

## 4. Running Tests

### Automated Suite
```bash
# Run pytest within the running Docker container
docker exec -it docmind-api pytest
```

### Manual Verification
1.  Navigate to `http://localhost:3000`.
2.  Upload a PDF.
3.  Ask: "What is this document about?".
4.  Verification is successful if the AI cites specific sections from the PDF.
