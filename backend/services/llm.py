
import os
from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()

# Initialize Both Clients
ollama_url = os.getenv("OLLAMA_BASE_URL", "http://host.docker.internal:11434")
ollama_model = os.getenv("OLLAMA_MODEL", "llama3")  # Default to Server Standard (llama3:latest)

openai_llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.0
)

# We initialize Ollama client lazily or just have it ready
# If Ollama isn't running, this object creation is fine, it only fails on invoke
ollama_llm = ChatOllama(
    base_url=ollama_url,
    model=ollama_model,
    temperature=0.0
)

def generate_answer(context: str, question: str, provider: str = "openai") -> str:
    """
    Generates an answer using the selected provider (openai or ollama).
    """
    
    # Select the model
    if provider == "ollama":
        print(f"DEBUG: Generating answer using Ollama ({ollama_model})")
        llm = ollama_llm
    else:
        print("DEBUG: Generating answer using OpenAI (GPT-4o mini)")
        llm = openai_llm

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are DocMind AI, a helpful enterprise assistant. 
        Use ONLY the following context to answer the user's question. 
        If the answer is not in the context, say "I don't have enough information in the provided documents to answer that."
        
        Context:
        {context}
        """),
        ("user", "{question}")
    ])
    
    chain = prompt | llm | StrOutputParser()
    
    return chain.invoke({
        "context": context,
        "question": question
    })
