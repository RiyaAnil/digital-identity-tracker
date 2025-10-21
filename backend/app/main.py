# app/main.py
from fastapi import FastAPI
from app.api import accounts
from app.database import engine, Base

# Import models so they are registered with Base.metadata
import app.models  # noqa: F401

app = FastAPI(title="Digital Identity Tracker API ")
app.include_router(account.router)
# For development only: create tables automatically if they don't exist.
# In production use Alembic migrations instead.
Base.metadata.create_all(bind=engine)

@app.get("/")
def health():
    return {"status": "ok"}
