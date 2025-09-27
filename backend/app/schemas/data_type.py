# app/schemas/data_type.py
from pydantic import BaseModel
from typing import List
from uuid import UUID

class DataTypeBase(BaseModel):
    type_name: str
    sensitivity_weight: int

class DataTypeCreate(DataTypeBase):
    pass

class DataTypeResponse(DataTypeBase):
    id: UUID   # use UUID not str
    class Config:
        orm_mode = True

class AssignDataTypes(BaseModel):
    account_id: UUID
    data_type_ids: List[UUID]
