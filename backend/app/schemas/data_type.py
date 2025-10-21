from pydantic import BaseModel
from typing import List
from uuid import UUID

class DataTypeBase(BaseModel):
    type_name: str
    sensitivity_weight: int

class DataTypeCreate(DataTypeBase):
    pass

class DataTypeResponse(DataTypeBase):
    id: UUID

    model_config = {
        "from_attributes": True
    }

class AssignDataTypes(BaseModel):
    account_id: UUID
    data_type_ids: List[UUID]
