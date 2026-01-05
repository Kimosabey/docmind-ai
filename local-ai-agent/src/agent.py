import os
import sys
from langchain_openai import ChatOpenAI
from langchain_community.chat_models import ChatOllama
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import create_sql_agent
from dotenv import load_dotenv

# Load key from parent .env if possible
# We are in src/, so we go up two levels to local-ai-agent, then up to docmind-ai
parent_env = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '.env')
load_dotenv(parent_env)

# 1. Initialize the "Brain" (Multi-Model Support)
llm_provider = os.getenv("LLM_PROVIDER", "openai").lower()

if llm_provider == "ollama":
    print("🧠 Using Local Brain: Ollama (Llama 3)")
    llm = ChatOllama(
        model="llama3",
        temperature=0
    )
else:
    print("🧠 Using Cloud Brain: OpenAI (GPT-4o-mini)")
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ Error: OPENAI_API_KEY not found.")
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
    print(f"\n🤖 Agent thinking about: '{question}'...")
    try:
        response = agent_executor.invoke(question)
        print(f"💡 Answer: {response['output']}")
    except Exception as e:
        print(f"❌ Error: {e}")

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
