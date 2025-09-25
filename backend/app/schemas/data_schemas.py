from pydantic import BaseModel

class DataTypeCreate(BaseModel):
    type_name: str
    sensitivity_weight: int

class AccountDataAttach(BaseModel):
    account_id: int
    data_type_ids: list[int]
