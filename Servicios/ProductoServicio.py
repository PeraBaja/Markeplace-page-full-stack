from pathlib import Path
from pydantic import PositiveInt
from sqlalchemy import delete, insert, select, update
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Sequence
from Esquemas.Producto import ProductoCreate
from Modelos.ProductoModelo import ProductoModelo


def obtener_productos(db: Session) -> Sequence[ProductoModelo]:
    query = select(ProductoModelo)
    productos = db.execute(query).scalars().all()
    return productos


def crear_producto(producto: ProductoCreate, db: Session) -> ProductoModelo | None:
    try:
        nuevo_producto = ProductoModelo(**producto.model_dump())
        db.add(nuevo_producto)
        db.flush()
    except:
        nuevo_producto = None

    return nuevo_producto


def modificar_producto(id: PositiveInt, producto: ProductoCreate, db: Session) -> bool:
    query = (
        update(ProductoModelo)
        .where(ProductoModelo.id == id)
        .values(**producto.model_dump(exclude_none=True))
    )
    result = db.execute(query)
    return result.rowcount > 0


def eliminar_producto(id: PositiveInt, db: Session) -> bool:
    query = delete(ProductoModelo).where(ProductoModelo.id == id)
    try:
        result = db.execute(query)
    except IntegrityError:
        return False
    return result.rowcount > 0


def obtener_producto(id: PositiveInt, db: Session) -> ProductoModelo | None:
    query = select(ProductoModelo).where(ProductoModelo.id == id)
    producto = db.execute(query).scalar_one_or_none()
    return producto


def modificar_imagen(id: PositiveInt, ruta_imagen: Path, db: Session) -> bool:
    query = (
        update(ProductoModelo)
        .where(ProductoModelo.id == id)
        .values({"foto": f"{ruta_imagen}"})
    )
    result = db.execute(query)
    return result.rowcount > 0
