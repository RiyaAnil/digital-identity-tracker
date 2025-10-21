from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate

def create_account(db: Session, account: AccountCreate):
    db_account = Account(**account.model_dump())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def get_account(db: Session, account_id: int):
    return db.query(Account).filter(Account.id == account_id).first()

def get_accounts_by_profile(db: Session, profile_id: int):
    return db.query(Account).filter(Account.profile_id == profile_id).all()

def update_account(db: Session, account_id: int, account_update: AccountUpdate):
    db_account = get_account(db, account_id)
    if db_account:
        for key, value in account_update.model_dump(exclude_unset=True).items():
            setattr(db_account, key, value)
        db_account.last_active = datetime.now(timezone.utc)
        db.commit()
        db.refresh(db_account)
        return db_account
    return None

def delete_account(db: Session, account_id: int):
    db_account = get_account(db, account_id)
    if db_account:
        db.delete(db_account)
        db.commit()
        return True
    return False
