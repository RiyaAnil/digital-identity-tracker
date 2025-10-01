from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text  # <-- import this
from app.models import account, data_type
from app.routers import accounts, data_types
from app.core.database import get_db

app = FastAPI(title="Digital Identity Tracker")

# origins = [
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

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
