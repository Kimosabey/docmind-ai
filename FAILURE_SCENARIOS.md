# 🛑 Failure Scenarios & Troubleshooting - DocMind AI

This document outlines common failure points in the Hybrid RAG architecture and how to recover from them.

## 1. Vector Database (ChromaDB) Issues

### Scenario: "Connection Refused" to Chroma
- **Symptoms**: Backend logs show `ValueError: Could not connect to Chroma at host:8000`.
- **Cause**: The Docker container for ChromaDB is not running or healthy.
- **Recovery**:
  1. Check status: `docker ps`
  2. Inspect logs: `docker logs docmind-chroma`
  3. Restart: `docker-compose restart chroma`

### Scenario: Database Lock / Corruption
- **Symptoms**: `sqlite3.OperationalError: database is locked`.
- **Cause**: Multiple processes trying to write to the persistent volume simultaneously, or improper shutdown.
- **Recovery**:
  1. Stop containers: `docker-compose down`
  2. **Warning**: This deletes data if you delete the volume folder.
  3. Remove the specific lock file in `./chroma_data` if visible, otherwise restart the container stack.

## 2. Ingestion Failures

### Scenario: PDF Text Extraction Failed
- **Symptoms**: `processed_chunks: 0` or API Error 500.
- **Cause**: The PDF is likely image-based (scanned) rather than text-based. `pypdf` cannot read images (OCR is not enabled in standard mode).
- **Recovery**:
  - convert the PDF to a text-searchable PDF using Adobe Acrobat or an online OCR tool before uploading.

### Scenario: "Context Window Exceeded"
- **Symptoms**: OpenAI API returns `400 Bad Request` (Max tokens).
- **Cause**: The retrieved chunks + the system prompt exceed the model's context limit (128k for gpt-4o-mini, but limits may apply).
- **Recovery**:
  - The system is configured to retrieve standard chunks. If this happens, verify `backend/services/vector_store.py` isn't retrieving too many chunks (default `k=3`).

## 3. LLM/AI Issues

### Scenario: Rate Limiting
- **Symptoms**: `RateLimitError: You exceeded your current quota`.
- **Cause**: OpenAI API key has run out of credits or hit the RPM limit.
- **Recovery**:
  - proper error handling is in place to return a 500 error.
  - Check your OpenAI Billing dashboard.
  - Switch `LLM_PROVIDER` to `ollama` in `.env` to use the local model instead.

### Scenario: Hallucinations (Wrong Answers)
- **Symptoms**: The AI gives an answer that isn't in the document.
- **Cause**: Low retrieval quality or the model ignoring strict "Only use context" instructions.
- **Recovery**:
  - Use the **Neural Inspector** to see what chunks were actually retrieved. If the relevant text wasn't found, the embeddings might need tuning or the chunk size (1000) might be too small/large.

## 4. Frontend/Network

### Scenario: File Upload Stuck at 99%
- **Symptoms**: Progress bar fills but no success message.
- **Cause**: Nginx or Proxy timeout if the file is huge (>10MB) and processing takes >30s.
- **Recovery**:
  - The current MVP runs directly without Nginx. Ensure your browser isn't timing out. Check Backend console for "Processing..." logs.
