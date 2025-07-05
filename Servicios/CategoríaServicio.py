from pydantic import PositiveInt
from sqlalchemy import delete, insert, select, update
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Sequence
from Esquemas.Categoría import CategoríaCreate
from Modelos.CategoríaModelo import CategoríaModelo


def obtener_categorías(db: Session) -> Sequence[CategoríaModelo]:
    query = select(CategoríaModelo)
    categorías = db.execute(query).scalars().all()
    return categorías


def crear_categoría(categoría: CategoríaCreate, db: Session) -> CategoríaModelo | None:
    try:
        nueva_categoría = CategoríaModelo(**categoría.model_dump())
        db.add(nueva_categoría)
        db.flush()
    except:
        nueva_categoría = None

    return nueva_categoría


def modificar_categoría(
    id: PositiveInt, categoría: CategoríaCreate, db: Session
) -> bool:
    query = (
        update(CategoríaModelo)
        .where(CategoríaModelo.id == id)
        .values(**categoría.model_dump(exclude_none=True))
    )
    result = db.execute(query)
    return result.rowcount > 0


def eliminar_categoría(id: PositiveInt, db: Session) -> bool:
    query = delete(CategoríaModelo).where(CategoríaModelo.id == id)
    try:
        result = db.execute(query)
    except IntegrityError:
        return False
    return result.rowcount > 0


def obtener_categoría(id: PositiveInt, db: Session) -> CategoríaModelo | None:
    query = select(CategoríaModelo).where(CategoríaModelo.id == id)
    categoría = db.execute(query).scalar_one_or_none()
    return categoría


def obtener_categoría_por_descripcíon(
    descripcíon: str, db: Session
) -> CategoríaModelo | None:
    query = select(CategoríaModelo).where(CategoríaModelo.descripción == descripcíon)
    categoría = db.execute(query).scalar_one_or_none()
    return categoría
