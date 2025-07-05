from pydantic import PositiveInt
from sqlalchemy import delete, insert, select, update
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Sequence
from Esquemas.Venta import VentaCreate
from Modelos.VentaModelo import VentaModelo


def obtener_ventas(db: Session) -> Sequence[VentaModelo]:
    query = select(VentaModelo)
    ventas = db.execute(query).scalars().all()
    return ventas


def obtener_ventas_por_despachados(
    despachado: bool, db: Session
) -> Sequence[VentaModelo]:
    query = select(VentaModelo).where(VentaModelo.despachado == despachado)
    ventas = db.execute(query).scalars().all()
    return ventas


def obtener_ventas_por_id_usuario(
    id_usuario: PositiveInt, db: Session
) -> Sequence[VentaModelo]:
    query = select(VentaModelo).where(VentaModelo.id_usuario == id_usuario)
    ventas = db.execute(query).scalars().all()
    return ventas


def crear_venta(venta: VentaCreate, db: Session) -> VentaModelo | None:
    try:
        nueva_venta = VentaModelo(**venta.model_dump())
        db.add(nueva_venta)
        db.flush()
    except:
        nueva_venta = None

    return nueva_venta


def modificar_venta(id: PositiveInt, venta: VentaCreate, db: Session) -> bool:
    query = (
        update(VentaModelo)
        .where(VentaModelo.id == id)
        .values(**venta.model_dump(exclude_none=True))
    )
    result = db.execute(query)
    return result.rowcount > 0


def marcar_venta_como_despachada(
    id: PositiveInt, despachado: bool, db: Session
) -> bool:
    query = (
        update(VentaModelo)
        .where(VentaModelo.id == id)
        .values({"despachado": despachado})
    )
    result = db.execute(query)
    return result.rowcount > 0


def eliminar_venta(id: PositiveInt, db: Session) -> bool:
    query = delete(VentaModelo).where(VentaModelo.id == id)
    try:
        result = db.execute(query)
    except IntegrityError:
        return False
    return result.rowcount > 0


def obtener_venta(id: PositiveInt, db: Session) -> VentaModelo | None:
    query = select(VentaModelo).where(VentaModelo.id == id)
    venta = db.execute(query).scalar_one_or_none()
    return venta
