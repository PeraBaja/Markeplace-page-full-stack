from Config.database import Base
from sqlalchemy import ForeignKey, String, Column, Integer, Float
from Modelos.CategoríaModelo import CategoríaModelo
from Database.ForeingKeyCreator import fk


class ProductoModelo(Base):
    __tablename__ = "productos"

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    id_categoría = Column("id_categoría", fk(CategoríaModelo))
    nombre = Column("nombre", String(100), nullable=False, unique=True)
    precio = Column("precio", Float(2), nullable=False)
    foto = Column("foto", String(200))
