import os
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from typing import List
from dotenv import load_dotenv

load_dotenv()

CHROMA_URL = os.getenv("CHROMA_URL", "http://localhost:8001")

# Initialize Embeddings (Cost: $0.02 / 1M tokens) -> "Lower Model" for embeddings
embedding_function = OpenAIEmbeddings(
    model="text-embedding-3-small"
)

def get_vector_store():
    """Returns the ChromaDB Client connected to the local Docker instance."""
    return Chroma(
        collection_name="docmind_collection",
        embedding_function=embedding_function,
        client_settings=None, # In a real remote setup, we might need http client settings
        # Langchain's Chroma client is a bit tricky with http, better to use the specific http client params if needed
        # For now, simplistic setup. If using http client:
    )

# Correction for HTTP client usage with LangChain's Chroma wrapper
import chromadb
from chromadb.config import Settings

def get_chroma_client():
    client = chromadb.HttpClient(
        host="localhost", 
        port=8001,
        settings=Settings(allow_reset=True, anonymized_telemetry=False)
    )
    return client

def get_langchain_chroma():
    client = get_chroma_client()
    return Chroma(
        client=client,
        collection_name="docmind_collection",
        embedding_function=embedding_function,
    )

def add_documents_to_store(documents: List[Document]):
    db = get_langchain_chroma()
    db.add_documents(documents)
    return True

def query_documents(query: str, k: int = 3):
    db = get_langchain_chroma()
    return db.similarity_search(query, k=k)

def get_collection_stats():
    """Returns count and basic stats of the collection."""
    client = get_chroma_client()
    try:
        collection = client.get_collection("docmind_collection")
        return {
            "count": collection.count(),
            "name": collection.name,
            "metadata": collection.metadata
        }
    except Exception:
        return {"count": 0, "status": "empty"}

def list_documents(limit: int = 10):
    """Returns a sample of stored documents."""
    client = get_chroma_client()
    try:
        collection = client.get_collection("docmind_collection")
        # peek returns a dict with 'ids', 'embeddings', 'metadatas', 'documents'
        results = collection.peek(limit=limit)
        
        # Format for frontend
        formatted = []
        if results and results.get('ids'):
            for i in range(len(results['ids'])):
                formatted.append({
                    "id": results['ids'][i],
                    "content": results['documents'][i],
                    "metadata": results['metadatas'][i]
                })
        return formatted
    except Exception:
        return []
