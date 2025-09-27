from pydantic import BaseModel
from uuid import UUID

class AccountBase(BaseModel):
    email: str

class AccountCreate(AccountBase):
    password: str

class Account(AccountBase):
    id: UUID

    class Config:
        orm_mode = True
