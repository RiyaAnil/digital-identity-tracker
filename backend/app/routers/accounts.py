from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountResponse

router = APIRouter(prefix="/accounts", tags=["Accounts"])

# Create new account
@router.post("/", response_model=AccountResponse)
def create_account(account_data: AccountCreate, db: Session = Depends(get_db)):
    existing = db.query(Account).filter(Account.username == account_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_account = Account(**account_data.dict())
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account

# Get all accounts
@router.get("/", response_model=list[AccountResponse])
def list_accounts(db: Session = Depends(get_db)):
    return db.query(Account).all()

# Get a single account by ID
@router.get("/{account_id}", response_model=AccountResponse)
def get_account(account_id: UUID, db: Session = Depends(get_db)):  # <-- change str → UUID
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account
