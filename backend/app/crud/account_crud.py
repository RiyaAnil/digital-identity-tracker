from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.data_models import AccountModel
from app.schemas.account_schema import AccountCreate, AccountUpdate

# --- C: CREATE (Add a new account) ---
def create_account(db: Session, account: AccountCreate):
    # Convert Pydantic model to SQLAlchemy model
    db_account = AccountModel(**account.model_dump()) 
    db.add(db_account) # Stage the change
    db.commit() # Save to the database
    db.refresh(db_account) # Get the newly assigned ID and timestamps
    return db_account

# --- R: READ (Find one account by ID) ---
def get_account(db: Session, account_id: int):
    return db.query(AccountModel).filter(AccountModel.id == account_id).first()

# --- R: READ (Find all accounts for a given profile) ---
def get_accounts_by_profile(db: Session, profile_id: int):
    return db.query(AccountModel).filter(AccountModel.profile_id == profile_id).all()

# --- U: UPDATE (Change an existing account) ---
def update_account(db: Session, account_id: int, account_update: AccountUpdate):
    db_account = get_account(db, account_id)
    if db_account:
        # Loop over the fields provided in the update form
        for key, value in account_update.model_dump(exclude_unset=True).items():
            setattr(db_account, key, value)
        
        # 🔑 Key Requirement: Always update 'last_active' on any change
        db_account.last_active = datetime.now(timezone.utc)
        
        db.commit()
        db.refresh(db_account)
        return db_account
    return None

# --- D: DELETE (Remove an account) ---
def delete_account(db: Session, account_id: int):
    db_account = get_account(db, account_id)
    if db_account:
        db.delete(db_account)
        db.commit()
        return True
    return False