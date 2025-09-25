from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.data_type import account_data  # association table

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    service_name = Column(String, nullable=False)

    data_types = relationship(
        "DataType",
        secondary=account_data,
        back_populates="accounts"
    )
