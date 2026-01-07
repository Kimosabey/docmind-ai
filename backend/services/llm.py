import os
from langchain_openai import ChatOpenAI
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()

# Context-Aware LLM Loader
llm_provider = os.getenv("LLM_PROVIDER", "openai").lower()
ollama_url = os.getenv("OLLAMA_BASE_URL", "http://host.docker.internal:11434")

if llm_provider == "ollama":
    # Local Llama 3
    llm = ChatOllama(
        base_url=ollama_url,
        model="llama3.2",
        temperature=0.0
    )
else:
    # Default: OpenAI
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.0
    )

def generate_answer(context: str, question: str) -> str:
    """
    Generates an answer using GPT-4o-mini based on the provided context.
    """
    
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
