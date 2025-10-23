# app/routers/accounts.py
#This file defines all the API endpoints for accounts: creating, reading, updating, deleting, and fetching by profile. It also calculates risk score and active status dynamically so the frontend always sees up-to-date information.

from uuid import UUID
from datetime import datetime, timedelta
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate, AccountResponse
from app.crud import account_crud

router = APIRouter(
    prefix="/accounts",
    tags=["Accounts"]
)

# 🔹 Utility: calculate risk + activity dynamically
def add_risk_and_activity(account: Account) -> AccountResponse:
    """
    Calculates risk score and active status for a given account.
    """
    # Risk score based on associated data types
    risk_score = sum(dt.sensitivity_weight for dt in getattr(account, "data_types", []))
    
    # Determine if account is active (last 30 days)
    inactive_threshold = datetime.utcnow() - timedelta(days=30)
    is_active = account.last_active >= inactive_threshold if getattr(account, "last_active", None) else True

    return AccountResponse.from_orm(account).copy(update={"risk_score": risk_score, "is_active": is_active})

# 🔹 Create new account
@router.post("/", response_model=AccountResponse, status_code=status.HTTP_201_CREATED)
def create_account(account_data: AccountCreate, db: Session = Depends(get_db)):
    """
    Create a new account and set initial last_active timestamp.
    """
    # Check if username exists
    existing = db.query(Account).filter(Account.username == account_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Create account
    new_account = account_crud.create_account(db, account_data)
    
    return add_risk_and_activity(new_account)

# 🔹 Get all accounts
@router.get("/", response_model=List[AccountResponse])
def list_accounts(db: Session = Depends(get_db)):
    """
    List all accounts with computed risk score and active status.
    """
    accounts = db.query(Account).all()
    return [add_risk_and_activity(acc) for acc in accounts]

# 🔹 Get single account by ID
@router.get("/{account_id}", response_model=AccountResponse)
def get_account(account_id: UUID, db: Session = Depends(get_db)):
    """
    Retrieve a single account by UUID.
    """
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return add_risk_and_activity(account)

# 🔹 Update account by ID
@router.put("/{account_id}", response_model=AccountResponse)
def update_account(account_id: UUID, account_update: AccountUpdate, db: Session = Depends(get_db)):
    """
    Update an account and refresh last_active timestamp.
    """
    updated = account_crud.update_account(db, account_id, account_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Account not found")
    return add_risk_and_activity(updated)

# 🔹 Delete account by ID
@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(account_id: UUID, db: Session = Depends(get_db)):
    """
    Delete an account by ID.
    """
    success = account_crud.delete_account(db, account_id)
    if not success:
        raise HTTPException(status_code=404, detail="Account not found")
    return

# 🔹 Get accounts by profile
@router.get("/profile/{profile_id}", response_model=List[AccountResponse])
def get_accounts_by_profile(profile_id: UUID, db: Session = Depends(get_db)):
    """
    Retrieve all accounts associated with a profile ID.
    """
    accounts = account_crud.get_accounts_by_profile(db, profile_id)
    return [add_risk_and_activity(acc) for acc in accounts]
