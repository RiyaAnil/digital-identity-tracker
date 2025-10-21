# models/data_models.py

from sqlalchemy import (
    Column, 
    Integer, 
    String, 
    DateTime, 
    ForeignKey, 
    Table, 
    func # Used for automatic timestamps (e.g., func.now())
)
from sqlalchemy.orm import relationship

# ❗ Crucial Import: Get Base from your DB setup ❗
from .database import Base 

# -----------------------------------------------------
# 👥 Person C's Table Definition
# -----------------------------------------------------

class DataType(Base):
    """Defines the types of data stored in accounts (e.g., email, credit card)."""
    __tablename__ = 'data_types'
    id = Column(Integer, primary_key=True, index=True)
    type_name = Column(String(50), unique=True, nullable=False)
    sensitivity_weight = Column(Integer, default=0, nullable=False)
    
    # Define the reverse M:M relationship (linking back to accounts)
    accounts = relationship('Account', secondary='account_data', back_populates='data_types')


# -----------------------------------------------------
# 🔗 Shared Association Table (Many-to-Many junction)
# -----------------------------------------------------

account_data_association = Table(
    'account_data',
    Base.metadata,
    # Define composite Primary Keys
    Column('account_id', Integer, ForeignKey('accounts.id'), primary_key=True),
    Column('data_type_id', Integer, ForeignKey('data_types.id'), primary_key=True)
)


# -----------------------------------------------------
# 👤 Person B's Core Model
# -----------------------------------------------------

class Account(Base):
    """The main account model, linking a service to a user profile."""
    __tablename__ = 'accounts'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # 🔑 Person B's link to Person A's Profile (Assuming Person A uses 'profiles' table name)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False, index=True) 
    
    # 📝 Person B's required core fields
    service_name = Column(String(100), nullable=False)
    username_email = Column(String(150), nullable=False)
    
    # 📈 Tracking fields (Note: onupdate=func.now() updates timestamp on every change)
    last_active = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False) 
    status = Column(String(50), default="active", nullable=False) 
    
    # 🤝 Relationship to Person A's Profile Model (must be uncommented when Profile class is available)
    # profile = relationship("Profile", back_populates="accounts") 
    
    # 🔗 M:M Relationship to DataType (Person C)
    data_types = relationship(
        'DataType', 
        secondary=account_data_association, 
        back_populates='accounts'
    )