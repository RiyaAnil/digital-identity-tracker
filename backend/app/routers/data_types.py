from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.data_type import DataType
from app.models.account import Account
from app.schemas.data_type import DataTypeCreate, DataTypeResponse, AssignDataTypes

router = APIRouter(prefix="/data-types", tags=["Data Types"])

# Create new data type
@router.post("/", response_model=DataTypeResponse)
def create_data_type(data: DataTypeCreate, db: Session = Depends(get_db)):
    new_type = DataType(**data.dict())
    db.add(new_type)
    db.commit()
    db.refresh(new_type)
    return new_type

# Get all data types
@router.get("/", response_model=list[DataTypeResponse])
def list_data_types(db: Session = Depends(get_db)):
    return db.query(DataType).all()

# Assign multiple data types to an account
@router.post("/assign")
def assign_data_types(payload: AssignDataTypes, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == payload.account_id).first()
    if not account:
        return {"error": "Account not found"}

    data_types = db.query(DataType).filter(DataType.id.in_(payload.data_type_ids)).all()
    account.data_types.extend(data_types)
    db.commit()
    return {"message": "Data types assigned successfully"}
