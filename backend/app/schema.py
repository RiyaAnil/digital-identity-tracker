# app/schemas.py
from pydantic import BaseModel

class AccountCreate(BaseModel):
    profile_id: int
    service_name: str
    username: str
    status: str = "active"

class AccountResponse(BaseModel):
    id: int
    profile_id: int
    service_name: str
    username: str
    status: str

    class Config:
        orm_mode = True
