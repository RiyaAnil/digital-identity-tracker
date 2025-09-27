from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.core.database import Base  # import the Base from your DB setup

# association table for many-to-many
account_data_association = Table(
    'account_data',
    Base.metadata,
    Column('account_id', Integer, ForeignKey('accounts.id')),
    Column('data_type_id', Integer, ForeignKey('data_types.id'))
)

class DataType(Base):
    __tablename__ = 'data_types'
    id = Column(Integer, primary_key=True)
    type_name = Column(String, unique=True)
    sensitivity_weight = Column(Integer)

class Account(Base):
    __tablename__ = 'accounts'
    id = Column(Integer, primary_key=True)
    # other fields ...
    data_types = relationship('DataType', secondary=account_data_association, backref='accounts')
