from Config.database import Base
from sqlalchemy import String, Column, Integer, Enum
from Esquemas.Usuario import Rol


class UsuarioModelo(Base):
    __tablename__ = "usuarios"
    id = Column("id", Integer, primary_key=True, autoincrement=True)
    dirección_correo = Column(
        "dirección_correo", String(50), nullable=False, unique=True
    )
    contraseña = Column("contraseña", String(500), nullable=False)
    apellido_nombre = Column("apellido_nombre", String(100), nullable=False)
    teléfono = Column("teléfono", String(15))
    ciudad = Column("ciudad", String(30))
    país = Column("país", String(30))
    foto_perfil = Column("foto_perfil", String(50))
    rol = Column("rol", Enum(Rol), nullable=False)
