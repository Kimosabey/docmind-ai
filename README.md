# DocMind AI - Hybrid RAG Intelligence System

> **Hybrid RAG Engine**: Seamlessly toggling between Cloud (OpenAI) and Local (Ollama) inference for enterprise-grade document intelligence.

<div align="center">

![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-FastAPI_Next.js_ChromaDB-009688?style=for-the-badge)

</div>

---

## 🚀 Quick Start
Launch the platform in 3 commands:

```bash
# 1. Start Docker Backend (ChromaDB + FastAPI)
docker-compose up -d --build

# 2. Setup Frontend
cd frontend && npm install

# 3. Start Frontend Dashboard
npm run dev
```

---

## 🖼️ Screenshots / Demo
Standard assets following the [V3 Portfolio Asset Planner](../../PORTFOLIO_ASSET_PLANNER.md).

| ![Hero](./docs/assets/hero_main.png) | ![Dashboard](./docs/assets/dashboard.png) |
|:---:|:---:|
| **Smart Document Chat** | **Retrieval Analytics** |

| ![Workflow](./docs/assets/workflow.png) | ![Architecture](./docs/assets/architecture.png) |
|:---:|:---:|
| **RAG Hybrid Pipeline** | **Distributed Knowledge System** |

---

## ✨ Key Features
*   **🧠 Hybrid Brain**: Switch between **GPT-4o** (Cloud) and **Llama 3** (Local) instantly.
*   **📚 RAG Pipeline**: Production-grade Recursive Character Splitting (1000/200).
*   **🔍 Neural Inspector**: Visual debugging tool to see what's inside your Vector DB.
*   **🔒 Privacy First**: Fully local vector storage using self-hosted **ChromaDB**.

---

## 🧠 Architecture
DocMind features a hybrid inference bridge that allows it to operate either via high-performance cloud APIs or completely offline using quantized local models.

![Architecture](./docs/assets/architecture.png)

### 🎯 Senior Engineer Signals
*   **Hybrid Inference Abstraction**: Built a provider-agnostic interface to swap LLMs (Local vs Cloud) without modifying the core RAG logic.
*   **Search Optimization**: Implemented **Hybrid Search** combining Semantic (ChromaDB Vector) and Path-based (Metadata) filtering to eliminate hallucinations.
*   **Data Sovereignty**: Designed for air-gapped environments; all documents remain on the client's infrastructure via local vector stores.

---

## 🧪 Testing & Scripts
```bash
# Run Backend API Tests
pytest

# Test Vector Store Connectivity
python scripts/test_chroma.py

# Benchmark Retrieval Accuracy
python scripts/benchmark_rag.py
```

---

## 📚 Documentation
Strict compliance with [PORTFOLIO_DOCS_STANDARD.md](../../PORTFOLIO_DOCS_STANDARD.md).

| Document | Description |
| :--- | :--- |
| [**System Architecture**](./docs/ARCHITECTURE.md) | Chunking, Embeddings, and HLD. |
| [**Getting Started**](./docs/GETTING_STARTED.md) | Setup guide for Cloud vs Local mode. |
| [**Failure Scenarios**](./docs/FAILURE_SCENARIOS.md) | Handling "Hallucinations" and Rate Limits. |
| [**Interview Q&A**](./docs/INTERVIEW_QA.md) | "What is RAG?" and "Why Vector DBs?". |

---

## 🔧 Tech Stack
| Component | Technology | Role |
| :--- | :--- | :--- |
| **Brain** | **FastAPI (Python)** | LangChain Orchestrator. |
| **Memory** | **ChromaDB** | Local Vector Store. |
| **Intelligence** | **OpenAI / Ollama** | LLM Inference Backends. |
| **Interface** | **Next.js 14** | Enterprise Dashboard. |

---

## 🔮 Future Enhancements
*   [ ] Integration with **Multi-Modal Embeddings** (Images + Text).
*   [ ] Support for **Knowledge Graph** (Neo4j) hybrid retrieval.

---

## 📝 License
Licensed under the MIT License.

---

## 👤 Author

**Harshan Aiyappa**  
Senior Full-Stack Hybrid AI Engineer  
Voice AI • Distributed Systems • Infrastructure

[![Portfolio](https://img.shields.io/badge/Portfolio-kimo--nexus.vercel.app-00C7B7?style=flat&logo=vercel)](https://kimo-nexus.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Kimosabey-black?style=flat&logo=github)](https://github.com/Kimosabey)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Harshan_Aiyappa-blue?style=flat&logo=linkedin)](https://linkedin.com/in/harshan-aiyappa)
[![X](https://img.shields.io/badge/X-@HarshanAiyappa-black?style=flat&logo=x)](https://x.com/HarshanAiyappa)
