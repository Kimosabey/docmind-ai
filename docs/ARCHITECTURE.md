# 🏗️ Architectural Decisions Record (ADR)

## ADR-001: Hybrid RAG Architecture

### 1. Context
We needed a system that allows users to query private documents (PDFs) without exposing the entire dataset to public model training, while retaining the high-quality reasoning capabilities of top-tier LLMs.

### 2. Decision
We chose a **Hybrid RAG** (Retrieval-Augmented Generation) pattern.
- **Local State**: Vector Store (ChromaDB) runs in a local Docker container.
- **Remote Intelligence**: Inference is offloaded to OpenAI's `gpt-4o-mini` API.

### 3. Alternatives Considered

#### Option A: Fully Local (Ollama / Llama-3)
- **Pros**: 100% Privacy, no API costs.
- **Cons**: High latency (10s+ on CPU), requires heavy hardware (16GB+ RAM), complex setup for average users.
- **Verdict**: Rejected for Phase 1 due to poor UX (latency).

#### Option B: Fully Cloud (Pinecone + GPT-4)
- **Pros**: Zero infrastructure management, extremely fast.
- **Cons**: All private data lives on 3rd party servers (Pinecone). High cost for storage and high-tier GPT-4 calls.
- **Verdict**: Rejected due to Data Sovereignty requirements.

### 4. The Chosen "Hybrid" Path
By using **ChromaDB locally**, we ensure:
1.  **Data Control**: Vectors live on the user's disk / VPC.
2.  **Performance**: Local network retrieval is faster than cloud hops.
3.  **Cost Efficiency**: We only pay for the *reasoning* (tokens input/output), not for the storage or retrieval operations.
4.  **Hardware Agnostic**: Runs on a standard laptop Docker container; no GPU required.

![Ingestion Pipeline](docs/images/docmind_ingestion_pipeline.png)

---

## 🔄 Complete RAG Pipeline

![RAG Pipeline Flow](images/rag_pipeline_flow.png)

The diagram above shows the complete end-to-end flow from document upload to answer generation. Each step is optimized for performance and privacy:

1. **Upload**: User submits PDF through frontend
2. **Extract**: Backend parses PDF text
3. **Chunk**: Text split into semantic segments
4. **Embed**: Chunks converted to 1536-dimension vectors
5. **Store**: Vectors saved locally in ChromaDB
6. **Query**: User asks a question
7. **Search**: Find top-3 most similar chunks
8. **Generate**: LLM creates answer from context

---

## System Components

### A. The Ingestion Engine (`backend/services/ingestion.py`)
- **Library**: `pypdf` + `LangChain`
- **Strategy**: Recursive Character Validation.
- **Chunk Size**: 1000 characters.
- **Overlap**: 200 characters.
- **Reasoning**: overlap ensures that context (like a sentence flowing from line 10 to 11) isn't cut off mid-thought, preserving semantic meaning for the embedding model.

### B. The Vector Store (`backend/services/vector_store.py`)
- **Engine**: ChromaDB
- **Model**: `text-embedding-3-small` (OpenAI).
- **Dimensions**: 1536.
- **Persistence**: Mounted Docker volume (`./chroma_data`).

### C. The Cortex (Multi-Model Support)
> *New in Phase 3: Switch between Cloud and Local Intelligence.*

![Multi-Model Architecture](docs/images/multi_model_architecture.png)

The system now supports a **Strategy Pattern** for the LLM Provider, controlled via the `LLM_PROVIDER` environment variable.

| Provider             | Model         | Use Case                      | trade-off                          |
| :------------------- | :------------ | :---------------------------- | :--------------------------------- |
| **OpenAI** (Default) | `gpt-4o-mini` | Production, Complex Reasoning | Cost ($), External Data Flow       |
| **Ollama**           | `llama3`      | High-Privacy, Offline, Dev    | Latency (CPU dependent), Zero Cost |

---

## 🔮 Future Scalability
To scale this to **Production (10k Users)**, we would:
1.  Replace Local Docker Chroma with **Chroma Client/Server Mode** clusters.
2.  Implement **Celery/Redis** for async document processing (Queue).
3.  Add **Redis Caching** for frequently asked questions to bypass the LLM entirely.
