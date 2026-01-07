import sqlite3
import os

def init_db():
    # Ensure data directory exists
    db_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
    if not os.path.exists(db_dir):
        os.makedirs(db_dir)
        
    db_path = os.path.join(db_dir, "sales.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create Tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT,
        signup_date DATE
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        amount DECIMAL(10, 2),
        order_date DATE,
        status TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # Seed Data
    users = [
        (1, "Alice Smith", "alice@example.com", "2024-01-15"),
        (2, "Bob Jones", "bob@example.com", "2024-02-20"),
        (3, "Charlie Day", "charlie@example.com", "2024-03-05"),
    ]
    
    orders = [
        (101, 1, 120.50, "2024-01-16", "COMPLETED"),
        (102, 1, 450.00, "2024-02-01", "COMPLETED"),
        (103, 2, 60.00, "2024-02-21", "PENDING"),
        (104, 3, 25.99, "2024-03-06", "COMPLETED"),
        (105, 3, 1200.00, "2024-03-10", "RETURNED"),
    ]

    cursor.executemany("INSERT OR IGNORE INTO users VALUES (?, ?, ?, ?)", users)
    cursor.executemany("INSERT OR IGNORE INTO orders VALUES (?, ?, ?, ?, ?)", orders)

    conn.commit()
    conn.close()
    print("[OK] Database 'sales.db' created and seeded successfully.")

if __name__ == "__main__":
    init_db()
