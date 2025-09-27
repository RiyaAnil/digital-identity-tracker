from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text  # <-- import this
from app.models import account, data_type
from app.routers import accounts, data_types
from app.database import get_db

app = FastAPI()

# Register routers
app.include_router(accounts.router)
app.include_router(data_types.router)

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1")).fetchone()  # <-- wrap SQL in text()
        if result:
            return {"message": "Database connection successful!"}
    except Exception as e:
        return {"message": "Database connection failed", "error": str(e)}
