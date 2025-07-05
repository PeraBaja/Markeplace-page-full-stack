from pathlib import Path
from pydantic import PositiveInt
from sqlalchemy import delete, insert, select, update
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Sequence
from Esquemas.Usuario import UsuarioCreate
from Modelos.UsuarioModelo import UsuarioModelo
from auth.seguridad import pwd_context


def obtener_usuarios(db: Session) -> Sequence[UsuarioModelo]:
    query = select(UsuarioModelo)
    usuarios = db.execute(query).scalars().all()
    return usuarios


def crear_usuario(usuario: UsuarioCreate, db: Session) -> UsuarioModelo | None:
    usuario.contraseña = pwd_context.hash(usuario.contraseña)
    try:
        nuevo_usuario = UsuarioModelo(**usuario.model_dump())
        db.add(nuevo_usuario)
        db.flush()
    except:
        nuevo_usuario = None

    return nuevo_usuario


def modificar_usuario(id: PositiveInt, usuario: UsuarioCreate, db: Session) -> bool:
    usuario.contraseña = pwd_context.hash(usuario.contraseña)
    query = (
        update(UsuarioModelo)
        .where(UsuarioModelo.id == id)
        .values(**usuario.model_dump(exclude_none=True))
    )
    result = db.execute(query)
    return result.rowcount > 0


def eliminar_usuario(id: PositiveInt, db: Session) -> bool:
    query = delete(UsuarioModelo).where(UsuarioModelo.id == id)
    try:
        result = db.execute(query)
    except IntegrityError:
        return False
    return result.rowcount > 0


def obtener_usuario_por_correo(correo: str, db: Session) -> UsuarioModelo | None:
    query = select(UsuarioModelo).where(UsuarioModelo.dirección_correo == correo)
    usuario = db.execute(query).scalar_one_or_none()
    return usuario


def obtener_usuario(id: PositiveInt, db: Session) -> UsuarioModelo | None:
    query = select(UsuarioModelo).where(UsuarioModelo.id == id)
    usuario = db.execute(query).scalar_one_or_none()
    return usuario


def modificar_imagen(id: PositiveInt, ruta_imagen: Path, db: Session) -> bool:
    query = (
        update(UsuarioModelo)
        .where(UsuarioModelo.id == id)
        .values({"foto_perfil": f"{ruta_imagen}"})
    )
    result = db.execute(query)
    return result.rowcount > 0
