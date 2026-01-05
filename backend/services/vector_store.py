import os
from typing import List
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_community.embeddings import HuggingFaceEmbeddings

# Initialize Embeddings (Local/Free)
# Using 'all-MiniLM-L6-v2' (GOOD quality, 384 dimensions, faster download)
# Explicitly set cache folder for Docker compatibility
embedding_function = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    cache_folder="/tmp/hf_cache",
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': False}
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
    # Check if we are in "Local Mode" (no Docker)
    # If CHROMA_HOST is "local" or unset, use an embedded PersistentClient
    host = os.getenv("CHROMA_HOST", "local")
    
    if host == "local":
        print("DEBUG: Using Local PersistentClient for ChromaDB")
        # Store data in a folder named 'chroma_data_local' in the project root
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        persist_path = os.path.join(base_dir, "chroma_data_local")
        return chromadb.PersistentClient(path=persist_path)
    
    # Otherwise, assume Docker HTTP Client
    port = int(os.getenv("CHROMA_PORT", 8000))
    print(f"DEBUG: Connecting to ChromaDB via HTTP at {host}:{port}")
    return chromadb.HttpClient(
        host=host, 
        port=port,
        settings=Settings(allow_reset=True, anonymized_telemetry=False)
    )

def get_langchain_chroma():
    client = get_chroma_client()
    # Ensure embedding function is valid
    return Chroma(
        client=client,
        collection_name="docmind_collection",
        embedding_function=embedding_function,
    )

def add_documents_to_store(documents: List[Document]):
    print(f"DEBUG: Attempting to add {len(documents)} documents.")
    if not documents:
        print("DEBUG: No documents to add.")
        return False
        
    try:
        # Test embedding one doc
        sample_text = documents[0].page_content
        print(f"DEBUG: Sample text length: {len(sample_text)}")
        sample_emb = embedding_function.embed_query(sample_text)
        print(f"DEBUG: Sample embedding generated. Type: {type(sample_emb)}, Len: {len(sample_emb)}")
    except Exception as e:
        print(f"DEBUG: Embedding generation failed: {e}")
        import traceback
        traceback.print_exc()
        raise e

    db = get_langchain_chroma()
    db.add_documents(documents)
    print("DEBUG: Documents added to Chroma.")
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
