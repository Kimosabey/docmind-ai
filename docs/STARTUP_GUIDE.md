# 🚀 DocMind AI - Startup Guide

Follow this guide to get the `DocMind AI` platform running on your local machine.

## 📋 Prerequisites

Ensure you have the following installed:
- **Docker Desktop** (Running)
- **Node.js** (v18 or higher)
- **Python** (3.10 or higher)
- **Git**

## 🛠️ Step 1: Clone & Configure

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Kimosabey/docmind-ai.git
   cd docmind-ai
   ```

2. **Environment Configuration**
   The project requires an environment file. We have provided an example.
   
   *Copy the example file to `.env`:*
   ```bash
   # Windows PowerShell
   copy .env.example .env
   ```
   
   **Critical**: Open `.env` and paste your actual OpenAI API Key:
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   LLM_PROVIDER=openai
   ```

## 🐳 Step 2: Start Infrastructure (Backend & Database)

We use Docker to orchestrate the Vector Database (ChromaDB) and the Python Backend.

1. **Build and Run**
   ```bash
   docker-compose up -d --build
   ```
   
2. **Verify Services**
   - **Backend API**: `http://localhost:8000/docs` (Swagger UI should load)
   - **ChromaDB**: Running internally on port 8000/8001 (mapped in docker-compose).

## 💻 Step 3: Start Frontend

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   Open your browser to: **[http://localhost:3000](http://localhost:3000)**

## 🧪 Verification Checklist

- [ ] Open `http://localhost:3000`. You should see the "DocMind" Chat Interface.
- [ ] Upload a sample PDF (e.g., a policy document).
- [ ] Wait for the "Processed Successfully" toast notification.
- [ ] Ask a question about the PDF.
- [ ] Click the **Database Icon** (top right) to confirm chunks were stored in the Neural Inspector.

## 🛑 Failure Scenarios & Troubleshooting

**Issue**: `Connection Refused` on Frontend?
- **Fix**: Ensure Backend is running. Check `docker logs docmind-api`.

**Issue**: `ChromaDB` connection error?
- **Fix**: Ensure the persistent volume folder isn't corrupted. Try `docker-compose down -v` to reset data.

---
*Enjoy using DocMind!*
