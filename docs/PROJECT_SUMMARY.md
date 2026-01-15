# 🧠 DocMind AI - Enterprise Hybrid RAG Platform

> **Privy-First Intelligence. Local Storage, Cloud Reasoning.**

DocMind AI is a state-of-the-art **Hybrid Retrieval Augmented Generation (RAG)** system designed to bridge the gap between Data Privacy and Advanced AI Reasoning. By decoupling storage from intelligence, we allow enterprises to chat with their sensitive PDF documents without ever uploading the full dataset to a third-party cloud.

![DocMind Dashboard Mockup](docs/assets/docmind_ui_mockup.png)

## 🌟 Key Features

### 🛡️ Privacy-First Architecture
- **Local Embeddings**: Your document vectors utilize `ChromaDB` running in a local Docker container.
- **Zero-Data Training**: Your data is **never** used to train public models. Only relevant snippets are sent for inference.

### ⚡ High-Performance "Hybrid" Engine
- **Storage**: Hosted locally for speed and control.
- **Compute**: Offloaded to `GPT-4o-mini` for cost-effective, high-accuracy reasoning.
- **latency**: Optimized <2s response times for standard queries.

### 👁️ Neural Inspector
- **Transparency**: Built-in debugging tools to visualize what the AI is "reading".
- **stats**: Real-time vector store statistics and chunk visualization.

### 🎨 Modern Experience
- **Glassmorphism UI**: A stunning, responsive Next.js 14 interface with `Framer Motion` animations.
- **Interactive**: Real-time streaming responses (simulated/actual), file upload progress, and dynamic visualizations.

## 🏗️ Technology Stack

| Domain | Tech | Role |
| :--- | :--- | :--- |
| **Frontend** | `Next.js 14` | React Framework with Server Components |
| **Styling** | `Tailwind CSS` | Utility-first styling with Glassmorphism support |
| **Animation** | `Framer Motion` | Fluid interface transitions |
| **Backend** | `FastAPI` | High-concurrency Async Python API |
| **Vector DB** | `ChromaDB` | Privacy-focused local embedding store |
| **AI Model** | `GPT-4o-mini` | Reasoning Engine (via OpenAI) |
| **Embeddings** | `all-MiniLM-L6-v2` | Local HuggingFace embedding model |

## 🚀 System Status

- **Status**: 🟢 Production Ready (MVP)
- **Version**: 1.0.0
- **Last Updated**: January 2026

---

*Built with ❤️ by the DocMind Team*
