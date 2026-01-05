from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from services.ingestion import save_upload_file_temp, process_pdf
from services.vector_store import add_documents_to_store, query_documents
from services.llm import generate_answer

app = FastAPI(
    title="DocMind AI API",
    description="Hybrid RAG Engine (formerly SpecLens)",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]

@app.get("/")
async def root():
    return {"message": "DocMind AI API is running", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "api"}

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # 1. Save temp file
        temp_path = save_upload_file_temp(file)
        
        # 2. Process & Chunk
        chunks = process_pdf(temp_path)
        
        # 3. Embed & Store
        add_documents_to_store(chunks)
        
        return {
            "message": "Document processed successfully",
            "chunks_count": len(chunks),
            "filename": file.filename
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # 1. Retrieve Context
        relevant_docs = query_documents(request.question)
        context_text = "\n\n".join([doc.page_content for doc in relevant_docs])
        
        # 2. Generate Answer
        answer = generate_answer(context_text, request.question)
        
        # 3. Extract Sources (metadata)
        sources = list(set([doc.metadata.get("source", "unknown") for doc in relevant_docs]))
        
        return ChatResponse(answer=answer, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from services.vector_store import get_collection_stats, list_documents

@app.get("/api/debug/stats")
async def get_stats():
    return get_collection_stats()

@app.get("/api/debug/documents")
async def get_docs(limit: int = 20):
    return list_documents(limit=limit)

@app.get("/api/system/status")
async def get_system_status():
    """Returns comprehensive AI model and system configuration"""
    import os
    import platform
    import psutil
    
    llm_provider = os.getenv("LLM_PROVIDER", "openai").lower()
    
    # System metrics
    cpu_percent = psutil.cpu_percent(interval=0.1)
    memory = psutil.virtual_memory()
    
    return {
        # AI Models
        "embedding_model": "all-mpnet-base-v2",
        "embedding_dimensions": 768,
        "llm_provider": llm_provider,
        "llm_model": "llama3" if llm_provider == "ollama" else "gpt-4o-mini",
        
        # System Info
        "os": platform.system(),
        "os_version": platform.version(),
        "python_version": platform.python_version(),
        "cpu_count": psutil.cpu_count(),
        "cpu_percent": round(cpu_percent, 1),
        "ram_total_gb": round(memory.total / (1024**3), 2),
        "ram_used_gb": round(memory.used / (1024**3), 2),
        "ram_percent": round(memory.percent, 1),
        
        # Container info
        "container": "Docker",
        "backend": "FastAPI + Uvicorn"
    }
