# 🌊 System Flow & Lifecycle

This document traces the complete lifecycle of data within DocMind AI, from the moment a user uploads a PDF to the moment they receive an answer.

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant Frontend as 💻 UI (Next.js)
    participant Backend as 🚀 API (FastAPI)
    participant Ingestion as ⚙️ Ingestion Service
    participant Chroma as 🗄️ ChromaDB
    participant OpenAI as ☁️ LLM (GPT-4)

    Note over User, Frontend: Phase 1: Ingestion
    User->>Frontend: Uploads "Project_Specs.pdf"
    Frontend->>Backend: POST /api/upload (Multipart/form-data)
    Backend->>Ingestion: process_pdf(temp_file)
    Ingestion->>Ingestion: 1. Extract Text (PyPDF)
    Ingestion->>Ingestion: 2. Split into 1000-char chunks
    Ingestion->>Backend: Return Chunk List [C1, C2, C3...]
    Backend->>Chroma: add_documents(Chunks)
    Note over Chroma: Computes Embeddings Locally
    Chroma-->>Backend: Success
    Backend-->>Frontend: "Document Processed"
    Frontend-->>User: Show Success Toast

    Note over User, Frontend: Phase 2: Retrieval & Chat
    User->>Frontend: "What are the privacy requirements?"
    Frontend->>Backend: POST /api/chat (query="...")
    Backend->>Chroma: query_documents(query)
    Chroma-->>Backend: Returns Top 3 Chunks (C2, C8, C9)
    Backend->>Backend: Construct Prompt:\n"Context: [C2+C8+C9]\nUser: What are..."
    Backend->>OpenAI: Send Prompt
    OpenAI-->>Backend: Generated Answer
    Backend-->>Frontend: {answer: "...", sources: ["Project_Specs.pdf"]}
    Frontend-->>User: Displays Answer + Citations
```

## detailed Data Stages

1.  **Raw Input**: PDF Binary.
2.  **Text Extraction**: Plain string in memory.
3.  **Chunking**: List of strings with overlapping windows (to preserve context).
4.  **Vectorization**: 384-dimensional float arrays (using `all-MiniLM-L6-v2`).
5.  **Peristence**: Stored in `ChromaDB` (parquet files on disk).
6.  **Retrieval**: Identify chunks with smallest Cosine Distance to the query vector.
7.  **Synthesis**: LLM "reads" the retrieved text and formulates a human response.
