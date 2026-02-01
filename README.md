# DocMind AI (AG-15)
### Hybrid RAG Engine & Document Intelligence Platform

![DocMind AI Hero](./docs/assets/hero_main.png)

![Status](https://img.shields.io/badge/Status-100%25_Operational-success?style=for-the-badge)
![Category](https://img.shields.io/badge/Category-Gen_AI_Series-purple?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-FastAPI_Next.js_ChromaDB-black?style=for-the-badge)

---

## 🌌 Overview

**DocMind AI** is an enterprise-grade **Retrieval-Augmented Generation (RAG)** platform designed for privacy-first document intelligence. It allows users to query massive PDF datasets with citation-backed accuracy, leveraging a **Hybrid Inference Bridge** that toggles between high-performance cloud LLMs (OpenAI) and secure, local models (Llama 3).

Unlike basic wrappers, DocMind focuses on **Data Sovereignty**, ensuring that sensitive enterprise knowledge stays within the local infrastructure using self-hosted vector stores and local model quantization.

---

## 🏗️ Cognitive Hub (Architecture)

![Architecture Infographic](./docs/assets/architecture.png)

The system manages the AI lifecycle through a modular pipeline:

1.  **Semantic Ingestion**: PDF parsing using the recursive character splitter to maintain paragraph-level context.
2.  **Vector Intelligence**: ChromaDB integration for persistent, high-dimensional similarity search.
3.  **Hybrid Inference**: A provider-agnostic bridge that routes queries to either GPT-4o or Local Ollama instances.
4.  **Synthesis Engine**: LLM grounding logic that prevents hallucinations by enforcing strict context-only responses.

---

## 🎨 Professional Interface

![Dashboard Preview](./docs/assets/dashboard.png)

The platform features a **Modern Premium Neural Dashboard**:
- **Neural Inspector**: Real-time observability into the Vector DB state and chunk distribution.
- **Smart Chat UI**: A high-fidelity streaming interface with markdown support and source citations.
- **Knowledge Mesh**: visual overview of ingested documents and their current indexing status.

---

## 🔥 Senior Signals (Technical Highlights)

- **Hybrid Inference Abstraction**: Built a decoupled provider layer to swap between Cloud and Local inference without modifying the core RAG logic.
- **Search Optimization**: Implemented **Hybrid Search** combining Vector embeddings with Path-based metadata filtering for zero-noise retrieval.
- **Semantic Continuity**: Engineered a recursive splitting strategy with a 200-character overlap to preserve meaning across storage boundaries.
- **Privacy-First Engineering**: Designed the architecture specifically for air-gapped security, leveraging local **ChromaDB** and quantised model execution.

---

## ⚙️ Workflow Infographic

![Workflow Infographic](./docs/assets/workflow.png)

---

## 🚀 Quick Start

### 1. Engine Setup (Docker)
```bash
# Start FastAPI and ChromaDB
docker-compose up -d --build
```

### 2. Dashboard Launch
```bash
# Install and run the Next.js frontend
cd frontend
npm install
npm run dev
```

---

## 📚 Documentation Standard
This project strictly adheres to the [Kimo Portfolio Standard](../../PORTFOLIO_DOCS_STANDARD.md).

| Document | Description |
| :--- | :--- |
| [**System Architecture**](./docs/ARCHITECTURE.md) | Chunking strategies and Vector schemas. |
| [**Getting Started**](./docs/GETTING_STARTED.md) | Setup guide for Cloud vs Local mode. |
| [**Failure Scenarios**](./docs/FAILURE_SCENARIOS.md) | Hallucination prevention and recovery. |
| [**Interview Q&A**](./docs/INTERVIEW_QA.md) | "Why RAG?" and technical justifications. |

---

## 👤 Author

**Harshan Aiyappa**  
Senior Full-Stack Hybrid AI Engineer  
Voice AI • Distributed Systems • Infrastructure

[![Portfolio](https://img.shields.io/badge/Portfolio-kimo--nexus.vercel.app-00C7B7?style=flat&logo=vercel)](https://kimo-nexus.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Kimosabey-black?style=flat&logo=github)](https://github.com/Kimosabey)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Harshan_Aiyappa-blue?style=flat&logo=linkedin)](https://linkedin.com/in/harshan-aiyappa)
