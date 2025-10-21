

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ❗ IMPORTANT: Change this connection string for your PostgreSQL DB!
# Example for PostgreSQL: "postgresql+psycopg2://user:password@localhost/dbname"
SQLALCHEMY_DATABASE_URL = "postgresql://postgres.lbpuzkqbarlbfjqvlzbd:digidtra123@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Create the SQLAlchemy engine
# (connect_args is for SQLite only; remove for production PostgreSQL)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()

# Dependency to get a DB session for each API call (FastAPI standard)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()