import os
from tempfile import NamedTemporaryFile
from fastapi import UploadFile
from typing import List
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

def save_upload_file_temp(upload_file: UploadFile) -> str:
    try:
        suffix = os.path.splitext(upload_file.filename)[1]
        with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(upload_file.file, tmp)
            tmp_path = tmp.name
        return tmp_path
    finally:
        upload_file.file.close()

import shutil

def process_pdf(file_path: str) -> List[Document]:
    """
    Loads a PDF and splits it into chunks.
    """
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    
    split_docs = text_splitter.split_documents(docs)
    
    # Clean up temp file
    if os.path.exists(file_path):
        os.remove(file_path)
        
    return split_docs
