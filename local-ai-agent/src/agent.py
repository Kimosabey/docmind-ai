import os
import sys
from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import create_sql_agent
from dotenv import load_dotenv

# Load key from root .env file (consolidated config)
# We are in local-ai-agent/src/, so we go up two levels to project root
root_env = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '.env')
load_dotenv(root_env)

# 1. Initialize the "Brain" (Multi-Model Support)
llm_provider = os.getenv("LLM_PROVIDER", "openai").lower()

if llm_provider == "ollama":
    print("[AI] Using Local Brain: Ollama (Llama 3)")
    llm = ChatOllama(
        model="llama3",
        temperature=0
    )
else:
    print("[AI] Using Cloud Brain: OpenAI (GPT-4o-mini)")
    if not os.getenv("OPENAI_API_KEY"):
        print("[ERROR] OPENAI_API_KEY not found.")
        sys.exit(1)
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0
    )

# 2. Connect to the "Tool" (Database)
# DB is in ../data/sales.db relative to this script
db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "sales.db")
db = SQLDatabase.from_uri(f"sqlite:///{db_path}")

# 3. Create the Agent
agent_executor = create_sql_agent(
    llm=llm,
    db=db,
    agent_type="openai-tools",
    verbose=True
)

def ask_agent(question):
    print(f"\n[AGENT] Thinking about: '{question}'...")
    try:
        response = agent_executor.invoke(question)
        print(f"[ANSWER] {response['output']}")
    except Exception as e:
        print(f"[ERROR] {e}")

if __name__ == "__main__":
    print("Initializing Local AI Agent...")
    
    # Test Questions
    questions = [
        "How many users are in the database?",
        "Who spent the most money? Give their name and total amount.",
        "List all orders that have been returned."
    ]
    
    for q in questions:
        ask_agent(q)
