# 🎤 Interview Cheat Sheet: DocMind AI

## 1. The Elevator Pitch (2 Minutes)

"DocMind AI is a production-grade **RAG (Retrieval-Augmented Generation)** system designed for Privacy-First document intelligence.

It solves the 'context window' problem of LLMs by using a **Vector Database (ChromaDB)** as long-term memory.
1.  **Ingestion**: It chunks and embeds PDFs into vectors.
2.  **Hybrid Brain**: It enables switching between Cloud Models (GPT-4o) for accuracy and Local Models (Llama 3) for privacy.
3.  **Observability**: Unlike black-box RAG demos, I built a 'Neural Inspector' that visualizes the vector store's health in real-time."

---

## 2. "Explain Like I'm 5" (The Librarian)

"Imagine a Library (The Document) and a very smart Librarian (The AI).
*   **The Problem**: The Librarian cannot memorize every book in the world instantly.
*   **My Solution**: I created a card catalog (ChromaDB).
*   **Ingestion**: When a new book arrives, I photocopy the pages and file them in the catalog.
*   **Retrieval**: When you ask a question, I don't read the whole book. I look up the specific page in the catalog, hand *just that page* to the Librarian, and say 'Read this and answer the user'. This is faster and cheaper."

---

## 3. Tough Technical Questions

### Q: How do you handle Context Window limits?
**A:** "Instead of stuffing the entire 50-page PDF into the prompt (which is expensive and slow), I use **Semantic Search**.
I convert the user's question into a vector and find the 'Top 3' most similar text chunks (Cosine Similarity). I only send these 3 chunks to the LLM. This keeps the prompt small and focused."

### Q: Why ChromaDB? Why not Pinecone?
**A:** "Privacy and Portability. Pinecone is a managed cloud service. If I'm processing sensitive legal documents, sending vectors to the cloud is a risk. ChromaDB runs locally in a Docker container, ensuring data sovereignty—the data never leaves the server unless explicitly sent to OpenAI."

### Q: How do you split the text (Chunking Strategy)?
**A:** "I use a **Recursive Character Text Splitter** with a chunk size of 1000 and overlap of 200.
*   **Why 1000?**: It's roughly 1-2 paragraphs—enough context to answer a question.
*   **Why Overlap?**: It prevents cutting a sentence in half at the boundary. The overlap ensures continuity of meaning between chunks."
