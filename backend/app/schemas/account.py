from pydantic import BaseModel
from uuid import UUID

# Base schema for creating/updating an account
class AccountBase(BaseModel):
    username: str
    service_name: str

# Schema for creating an account (inherits Base)
class AccountCreate(AccountBase):
    pass  # no extra fields needed

# Schema for returning account data (includes ID)
class AccountResponse(AccountBase):
    id: UUID

    class Config:
        orm_mode = True
