from Config.database import Base
from sqlalchemy import String, Column, Integer, Boolean, ForeignKey
from Database.ForeingKeyCreator import fk
from Modelos.UsuarioModelo import UsuarioModelo
from Modelos.ProductoModelo import ProductoModelo


class VentaModelo(Base):
    __tablename__ = "ventas"
    id = Column("id", Integer, primary_key=True, autoincrement=True)
    id_producto = Column("id_producto", fk(ProductoModelo), nullable=False)
    id_usuario = Column("id_usuario", fk(UsuarioModelo), nullable=False)
    cantidad = Column("cantidad", Integer, nullable=False)
    despachado = Column("despachado", Boolean, nullable=False)
