#defines how data types are structured for the API. It validates inputs when creating or assigning data types and ensures API responses include the unique ID and all required fields

from pydantic import BaseModel
from typing import List
from uuid import UUID

class DataTypeBase(BaseModel):
    type_name: str
    sensitivity_weight: int

#creating a new data type.
class DataTypeCreate(DataTypeBase):
    pass

class DataTypeResponse(DataTypeBase):
    id: UUID

    model_config = {
        "from_attributes": True
    }

#assign data types
class AssignDataTypes(BaseModel):
    account_id: UUID
    data_type_ids: List[UUID]
