from .base import Base
from sqlalchemy import Column as Col, Integer, Text


class Column(Col):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('nullable', False)
        super().__init__(*args, **kwargs)


class EntityBase(Base):
    __abstract__ = True
    id = Column(
        Integer, primary_key=True, autoincrement=True
    )


class User(EntityBase):
    __tablename__ = "User"
    username = Column(Text)
    email = Column(Text)
    password_hash = Column(Text)
