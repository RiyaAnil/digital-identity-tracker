# backend/app/schemas/account_schema.py

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional # Allows fields to be optional for updates

# 1. Base Form: The essential data needed for an account
class AccountBase(BaseModel):
    # This links to Person A's table
    profile_id: int = Field(..., description="ID of the profile this account belongs to.")
    service_name: str = Field(..., max_length=100) # e.g., "Google"
    username_email: str = Field(..., max_length=150) # The login email/username
    status: str = Field('active', description="Status: 'active' or 'inactive'.")

# 2. Create Form: Used when a user adds a NEW account
class AccountCreate(AccountBase):
    pass

# 3. Update Form: Used when a user changes an existing account
class AccountUpdate(BaseModel):
    # Notice all fields are optional for updating
    profile_id: Optional[int] = None
    service_name: Optional[str] = None
    username_email: Optional[str] = None
    status: Optional[str] = None

# 4. Response/Read Form: What the API sends back (includes DB-generated IDs/timestamps)
class Account(AccountBase):
    id: int # The unique ID from the database
    last_active: datetime # Automatically tracked by the database
    created_at: datetime

    class Config:
        # 🔑 IMPORTANT: Tells Pydantic to work with SQLAlchemy models
        from_attributes = True 