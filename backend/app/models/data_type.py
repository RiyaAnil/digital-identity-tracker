from sqlalchemy import Column, String, Integer, Table, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base

account_data = Table(
    "account_data",
    Base.metadata,
    Column("account_id", UUID(as_uuid=True), ForeignKey("accounts.id"), primary_key=True),
    Column("data_type_id", UUID(as_uuid=True), ForeignKey("data_types.id"), primary_key=True)
)

class DataType(Base):
    __tablename__ = "data_types"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type_name = Column(String, unique=True, nullable=False)
    sensitivity_weight = Column(Integer, nullable=False)

    accounts = relationship(
        "Account",
        secondary=account_data,
        back_populates="data_types"
    )
