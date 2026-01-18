# ⚡ DocMind AI Backend

> High-performance async API built with **FastAPI** for document ingestion and RAG-powered chat.

## 🎯 Technical Implementation

The backend delivers enterprise-grade capabilities:

- **FastAPI Architecture**: Async Python APIs with auto-generated OpenAPI documentation and CORS support
- **End-to-End RAG Pipeline**: Complete Retrieval Augmented Generation implementation with ChromaDB integration
- **Vector Database Operations**: Efficient embedding generation, storage, and similarity search optimization
- **Multi-Model LLM Support**: Flexible strategy pattern enabling seamless switching between OpenAI and Ollama providers
- **Production-Ready Error Handling**: Comprehensive exception handling, request validation, and observability

---

## 🚀 Quick Start (Docker)

```bash
# Using docker-compose (recommended)
cd ..
docker-compose up -d --build
```

The API will be available at `http://localhost:8000`

### Manual Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY=sk-your-key
export CHROMA_HOST=localhost
export CHROMA_PORT=8001

# Run the server
uvicorn main:app --reload
```

---

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── services/
│   ├── ingestion.py       # Document processing & chunking
│   ├── llm.py             # Multi-model LLM provider (OpenAI/Ollama)
│   └── vector_store.py    # ChromaDB integration
├── Dockerfile             # Container configuration
└── requirements.txt       # Python dependencies
```

---

## 🔌 API Endpoints

### **POST** `/upload`
Upload and process a PDF document.

**Request**: `multipart/form-data` with `file` field  
**Response**: Confirmation with document statistics

### **POST** `/chat`
Query the RAG system with a question.

**Request**:
```json
{
  "message": "What are the key findings?",
  "provider": "openai"  // or "ollama"
}
```

**Response**:
```json
{
  "response": "Based on the document...",
  "sources": [...]
}
```

### **GET** `/stats`
Get vector database statistics.

**Response**:
```json
{
  "collections": [...],
  "total_documents": 42,
  "total_chunks": 1337
}
```

---

## 🧩 Key Components

### 1. **Ingestion Pipeline** (`services/ingestion.py`)
- PDF text extraction using `pypdf`
- Recursive character-based text chunking (1000 chars, 200 overlap)
- Metadata preservation (page numbers, sources)
- Batch embedding generation

### 2. **Vector Store** (`services/vector_store.py`)
- ChromaDB client management
- Embedding storage and retrieval
- Similarity search with top-k results
- Collection management

### 3. **LLM Provider** (`services/llm.py`)
- **OpenAI**: `gpt-4o-mini` for production
- **Ollama**: `llama3` for local/offline scenarios
- Strategy pattern for easy provider switching

---

## 🔧 Environment Variables

| Variable         | Default    | Description                  |
| :--------------- | :--------- | :--------------------------- |
| `OPENAI_API_KEY` | (required) | Your OpenAI API key          |
| `CHROMA_HOST`    | localhost  | ChromaDB server hostname     |
| `CHROMA_PORT`    | 8000       | ChromaDB server port         |
| `LLM_PROVIDER`   | openai     | LLM provider (openai/ollama) |

---

## 📊 How RAG Works

![RAG Pipeline](../docs/assets/rag_pipeline_flow.png)

1. **Ingest**: User uploads PDF
2. **Chunk**: Split into 1000-char segments with 200-char overlap
3. **Embed**: Convert to vectors using `text-embedding-3-small`
4. **Store**: Save in ChromaDB (local Docker)
5. **Retrieve**: On query, find top 3 similar chunks
6. **Generate**: Send chunks + question to LLM
7. **Respond**: Return grounded answer to user

---

## 🧪 Testing

```bash
# Interactive API docs
http://localhost:8000/docs

# Upload a test PDF
curl -X POST "http://localhost:8000/upload" \
  -F "file=@sample.pdf"

# Ask a question
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Summarize the document", "provider": "openai"}'
```

---

## 🔮 Production Considerations

For scaling to 10k+ users:
- Replace local ChromaDB with **Chroma Client/Server** mode
- Add **Celery + Redis** for async document processing queues
- Implement **Redis caching** for frequent queries
- Use **PostgreSQL** for metadata and user sessions
- Add **rate limiting** and authentication middleware

---

*Part of the DocMind AI Enterprise Intelligence Platform.*
