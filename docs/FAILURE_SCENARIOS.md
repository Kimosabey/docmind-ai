# 🛡️ Failure Scenarios & Resilience: DocMind AI

> Documenting edge cases and system safeguards for the RAG pipeline.

![RAG Workflow](./assets/workflow.png)

---

## 1. Fault Analysis

| Scenario | Impact | Safeguard Status |
| :--- | :--- | :--- |
| **OpenAI Rate Limit** | Chat becomes unavailable. | ** Exponential Backoff** implemented in `LLMService`. |
| **Corrupt PDF Upload** | Ingestion pipeline crashes. | ** File Type Verification** prior to chunking. |
| **ChromaDB Down** | Search returns 0 results. | ** Docker Health Checks** auto-restart the container. |
| **Hallucination** | AI makes up facts. | ** System Prompt Grounding** forbids external info. |

---

## 2. Recovery Strategy

### Handling Vector Store Failures
If ChromaDB is unreachable, the system triggers a `503 Service Unavailable` with a clean UI notification. Data is persisted to a Docker volume, ensuring that when the container restarts, all previously ingested documents remain searchable.

### Cold Start Mitigation
When switching from OpenAI to Local Llama 3, the first query can take ~30s for the model to load into VRAM. We implemented a **"Model Warming" status** in the UI to manage user expectations during this transition.

---

## 3. Chaos Testing

### The "President of Mars" Test
*   **Goal**: Verify strict grounding.
*   **Action**: Ask a question unrelated to the document (e.g., "What is the capital of France?").
*   **Expected**: The system must say "I cannot find this in the document," even if the LLM knows the answer from its training data.

### Large Document Stress Test
*   **Goal**: Verify chunking stability.
*   **Action**: Upload a 500+ page technical manual.
*   **Expected**: The system parses without memory overflow and maintains retrieval relevance using high-dimensional indexing.
