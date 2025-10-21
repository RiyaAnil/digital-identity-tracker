from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.schemas.data_type import DataTypeResponse

class AccountBase(BaseModel):
    username: str
    service_name: str

class AccountCreate(AccountBase):
    pass

class AccountUpdate(BaseModel):
    username: Optional[str] = None
    service_name: Optional[str] = None
    status: Optional[str] = None

class AccountResponse(AccountBase):
    id: UUID
    data_types: List[DataTypeResponse] = []
    risk_score: Optional[int] = 0
    is_active: Optional[bool] = True
    last_active: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }
