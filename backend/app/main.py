from fastapi import FastAPI
from app.models import account, data_type  # import your new models
from app.routers import accounts, data_types

app = FastAPI()
# Register routers
app.include_router(accounts.router)
app.include_router(data_types.router)

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}
