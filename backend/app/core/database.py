import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import psycopg2

load_dotenv()  # Load variables from .env

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env!")

# Create engine
engine = create_engine(DATABASE_URL, echo=True)  # echo=True will log SQL statements

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Test connection on startup
def test_connection():
    try:
        # Use raw psycopg2 to test network connection
        import psycopg2
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        print("✅ Database connection successful!")
        cur.close()
        conn.close()
    except Exception as e:
        print("❌ Database connection failed:", e)

if __name__ == "__main__":
    test_connection()
    from app.models import account, data_type  # import your models
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")
