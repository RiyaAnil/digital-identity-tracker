from fastapi import FastAPI
from app.models import account, data_type  # import your new models


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}
