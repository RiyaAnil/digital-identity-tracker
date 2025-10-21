# backend/app/api/endpoints/account.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# ❗ Correct Imports ❗
# Import your CRUD logic
from app.crud import account_crud
# Import your Pydantic schemas
from app.schemas.account_schema import Account, AccountCreate, AccountUpdate
# Import the shared database dependency
from app.core.database import get_db 

router = APIRouter(
    prefix="/accounts", # All endpoints here will start with /accounts
    tags=["Accounts"] # Groups them nicely in the documentation
)

# 1. POST: Create New Account (C in CRUD)
# NOTE: The 'profile_id' is expected within the 'AccountCreate' body, 
# which is the standard RESTful approach for creating a linked resource.
@router.post("/", response_model=Account, status_code=status.HTTP_201_CREATED)
def create_new_account(account: AccountCreate, db: Session = Depends(get_db)):
    """Creates a new account linked to a specific profile ID (contained in the request body)."""
    return account_crud.create_account(db=db, account=account)


# 2. GET: Get Account by ID (R in CRUD - Single)
@router.get("/{account_id}", response_model=Account)
def read_single_account(account_id: int, db: Session = Depends(get_db)):
    """Retrieves a single account by its unique ID."""
    db_account = account_crud.get_account(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account


# 3. GET: Get Accounts by Profile ID (R in CRUD - List)
@router.get("/profile/{profile_id}", response_model=List[Account])
def read_accounts_for_profile(profile_id: int, db: Session = Depends(get_db)):
    """Retrieves all accounts associated with a specific profile ID."""
    # This endpoint remains the same as it correctly filters by the Foreign Key
    return account_crud.get_accounts_by_profile(db, profile_id=profile_id)


# 4. PUT: Update Account by ID (U in CRUD)
@router.put("/{account_id}", response_model=Account)
def update_existing_account(account_id: int, account: AccountUpdate, db: Session = Depends(get_db)):
    """Updates the details of an existing account by ID, updating 'last_active' timestamp."""
    updated_account = account_crud.update_account(db, account_id=account_id, account_update=account)
    if updated_account is None:
        raise HTTPException(status_code=404, detail="Account not found for update")
    return updated_account


# 5. DELETE: Delete Account by ID (D in CRUD)
@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account_endpoint(account_id: int, db: Session = Depends(get_db)):
    """Permanently deletes an account by ID."""
    success = account_crud.delete_account(db, account_id=account_id)
    if not success:
        # We explicitly raise 404 if the CRUD function confirms the deletion failed
        raise HTTPException(status_code=404, detail="Account not found for deletion")
    return