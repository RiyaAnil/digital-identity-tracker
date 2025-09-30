from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base
from app.models.data_type import account_data  # association table

class Account(Base):
    __tablename__ = "accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=False)
    service_name = Column(String, nullable=False)
    last_active = Column(DateTime, default=func.now(), nullable=False)
    data_types = relationship(
        "DataType",
        secondary=account_data,
        back_populates="accounts"
    )
