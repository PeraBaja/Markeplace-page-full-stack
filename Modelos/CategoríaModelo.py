from Config.database import Base
from sqlalchemy import String, Column, Integer, Float


class CategoríaModelo(Base):
    __tablename__ = "categorias"
    id = Column("id", Integer, primary_key=True, autoincrement=True)
    descripción = Column("descripción", String(50), nullable=False, unique=True)
