from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

account_data = Table(
    "account_data",
    Base.metadata,
    Column("account_id", Integer, ForeignKey("accounts.id"), primary_key=True),
    Column("data_type_id", Integer, ForeignKey("data_types.id"), primary_key=True)
)

class DataType(Base):
    __tablename__ = "data_types"

    id = Column(Integer, primary_key=True, index=True)
    type_name = Column(String, unique=True, nullable=False)
    sensitivity_weight = Column(Integer, nullable=False)

    accounts = relationship(
        "Account",
        secondary=account_data,
        back_populates="data_types"
    )
