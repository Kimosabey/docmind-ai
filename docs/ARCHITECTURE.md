# System Architecture: DocMind AI

> High-performance RAG orchestration with hybrid cloud/local inference capabilities.

---

## 1. High-Level Design (HLD)

DocMind AI implements a **Hybrid RAG Architecture** (Retrieval-Augmented Generation). It allows seamless switching between Cloud (OpenAI) and Local (Ollama/Llama 3) inference engines, all backed by a persistent Vector Store (ChromaDB).

### System Workflow
![Architecture Diagram](./assets/architecture.png)

1.  **Ingestion**: Documents are parsed, chunked, and embedded into a vector space.
2.  **Storage**: Vectors are persisted in **ChromaDB** with metadata indexing.
3.  **Retrieval**: User queries are vectorized to find semantically relevant chunks via Cosine Similarity.
4.  **Synthesis**: Retrieved context is combined with the query and sent to the selected LLM (OpenAI or Local) for grounded response generation.

---

## 2. Low-Level Design (LLD)

### Data Models (ChromaDB / Vector Store)
*   **Collection**: `legal_docs` or `enterprise_knowledge`.
*   **Vector Dimensions**: 1536 (OpenAI `text-embedding-3-small`) or 4096 (Ollama `llama3`).
*   **Metadata**: `{ "source": "file.pdf", "page": 1, "chunk_index": 0 }`.

### The RAG Pipeline
*   **Parsing**: `pypdf` for text extraction.
*   **Chunking**: Recursive Character Splitting (Size: 1000, Overlap: 200).
*   **Embedding Gateway**: Unified interface to handle multiple vector providers.

---

## 3. Decision Log

### Why FastAPI over Next.js API?
*   **AI Ecosystem**: Python is the native tongue of LLMs. Libraries like `LangChain` and `chromadb` have significantly deeper feature support in Python.
*   **Performance**: Asynchronous FastAPI handles long-running LLM streaming responses more efficiently than JS-based serverless functions.

### Why ChromaDB?
*   **Privacy-First**: Unlike Pinecone, ChromaDB runs locally in Docker, ensuring sensitive documents never leave the client's infrastructure.
*   **Auto-persistence**: Provides easy-to-use persistent storage without the overhead of scaling a full database cluster.

---

## 4. Concept Deep Dives

### Hybrid Inference Strategy
The system implements a **Provider Abstraction Layer**. The core logic doesn't know if it's talking to OpenAI or a local Llama 3 instance. This allows enterprises to prototype on GPT-4 and move to self-hosted models for production to save costs and gain data sovereignty.

### Groundedness Enforcement
To eliminate LLM "Hallucinations", we use **Prompt Injection with Strict Constraints**. The system instruction forces the LLM to ignore its internal knowledge and rely strictly on the provided context chunks. If the answer isn't in the chunks, it must respond with a standardized "I cannot find the answer" message.
