# 🛡️ Failure Scenarios & Resilience

> "RAG Systems are only as good as their retrieval."

This document details how DocMind AI handles hallucinations, context window limits, and service failures.

## 1. Failure Matrix

| Component | Failure Mode | Impact | Recovery Strategy |
| :--- | :--- | :--- | :--- |
| **OpenAI API** | Rate Limit (429) | **Critical**. Chat fails. | **Exponential Backoff**. The `LLMService` retries request 3 times with increasing delays before failing gracefully. |
| **ChromaDB** | Container Crash | **High**. Retrieval fails. | **Restart Policy**. Docker Compose is set to `restart: always`. API throws 503 until DB is back. |
| **PDF Ingestion** | Encrypted/Corrupt File | **Minor**. Upload fails. | **Validation**. The Ingestion pipeline checks for file validity/password protection before attempting parse, returning a clean 400 error. |

---

## 2. Deep Dive: Handling "Hallucinations"

### The Problem
LLMs are confident liars. If the document doesn't contain the answer, they might make one up.

### The Solution: Groundedness Check
We modify the System Prompt to enforce strict grounding:
> "You are a helpful assistant. Use ONLY the following context to answer. If you cannot answer using the context, say 'I cannot find the answer in the document'."

**Evidence of Success**:
Try asking "Who is the President of Mars?".
*   **Result**: "I cannot find the answer in the document." (Instead of making up a fictional president).

---

## 3. Resilience Testing

### Test 1: The "Gibberish" Document
1.  Upload a PDF containing random symbols.
2.  **Expectation**: The system chunks it, but answering questions returns "I cannot find the answer..." or low confidence scores. It does NOT crash the chunker.

### Test 2: Database Kill
1.  Ingest a document.
2.  `docker stop docmind-chromadb`.
3.  Ask a question.
4.  **Expectation**: The Chat UI shows a red toast notification: "Vector Database Unavailable". The app remains responsive.
