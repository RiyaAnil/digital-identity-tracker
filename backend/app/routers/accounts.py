from uuid import UUID
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountResponse

router = APIRouter(prefix="/accounts", tags=["Accounts"])

# 🔹 Utility: calculate risk + activity dynamically
def add_risk_and_activity(account: Account) -> AccountResponse:
    # Risk score based on associated data types
    risk_score = sum(dt.sensitivity_weight for dt in account.data_types)
    
    # Determine if account is active (last 30 days)
    inactive_threshold = datetime.utcnow() - timedelta(days=30)
    is_active = account.last_active >= inactive_threshold if account.last_active else True

    return AccountResponse.from_orm(account).copy(update={"risk_score": risk_score, "is_active": is_active})

# 🔹 Create new account
@router.post("/", response_model=AccountResponse)
def create_account(account_data: AccountCreate, db: Session = Depends(get_db)):
    # Check if username exists
    existing = db.query(Account).filter(Account.username == account_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Create account with initial last_active
    new_account = Account(**account_data.dict())
    new_account.last_active = datetime.utcnow()
    
    db.add(new_account)
    db.commit()
    db.refresh(new_account)

    return add_risk_and_activity(new_account)

# 🔹 Get all accounts
@router.get("/", response_model=list[AccountResponse])
def list_accounts(db: Session = Depends(get_db)):
    accounts = db.query(Account).all()
    return [add_risk_and_activity(acc) for acc in accounts]

# 🔹 Get single account by ID
@router.get("/{account_id}", response_model=AccountResponse)
def get_account(account_id: UUID, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return add_risk_and_activity(account)
