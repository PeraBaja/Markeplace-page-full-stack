from sqlalchemy import ForeignKey
from Config.database import Base

from typing import Protocol, Type


class HasTablename(Protocol):
    __tablename__: str


def fk(modelo: type[HasTablename], columna: str = "id"):
    return ForeignKey(f"{modelo.__tablename__}.{columna}")
