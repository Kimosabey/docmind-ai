import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()

# Initialize LLM (Cost: $0.15 / 1M input tokens) -> "Lower Model" as requested
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
