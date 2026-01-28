import os
import shutil
from tempfile import NamedTemporaryFile
from fastapi import UploadFile
from typing import List
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

def save_upload_file_temp(upload_file: UploadFile) -> str:
    try:
        suffix = os.path.splitext(upload_file.filename)[1]
        if not suffix:
            suffix = ".pdf"
            
        with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            # For async UploadFile, it's safer to read content if we are in an async context, 
            # but since this function is synchronous, we rely on the caller or use upload_file.file.
            # However, safer to handle it in main.py or just use copyfileobj which usually works.
            # Let's ensure cursor is at start
            upload_file.file.seek(0)
            shutil.copyfileobj(upload_file.file, tmp)
            tmp_path = tmp.name
            
        # Verify file size
        size = os.path.getsize(tmp_path)
        print(f"DEBUG: Saved temp file to {tmp_path} (Size: {size} bytes)")
        return tmp_path
    except Exception as e:
        print(f"DEBUG: Error saving temp file: {e}")
        raise e

def process_pdf(file_path: str, original_filename: str = None) -> List[Document]:
    """
    Loads a PDF and splits it into chunks.
    """
    print(f"DEBUG: Processing PDF at: {file_path} (Original: {original_filename})")
    
    if not os.path.exists(file_path):
        print("DEBUG: File does not exist!")
        return []

    try:
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        print(f"DEBUG: Loaded {len(docs)} page(s) from PDF")
        
        if not docs:
            print("ERROR: PyPDFLoader returned 0 pages. The PDF might be empty or unreadable.")
            return []
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        
        split_docs = text_splitter.split_documents(docs)
        print(f"DEBUG: Split into {len(split_docs)} chunks")
        
        # Add source metadata to each chunk
        for doc in split_docs:
            if original_filename:
                doc.metadata["source"] = original_filename
            elif "source" not in doc.metadata:
                doc.metadata["source"] = os.path.basename(file_path)
        
        return split_docs
        
    except Exception as e:
        print(f"ERROR: Failed to process PDF: {e}")
        return []
    finally:
        # Clean up temp file
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"DEBUG: Removed temp file {file_path}")
            except Exception as e:
                print(f"DEBUG: Failed to remove temp file: {e}")
