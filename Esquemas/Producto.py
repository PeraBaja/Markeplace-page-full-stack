from pathlib import Path
from typing import Optional
from pydantic import BaseModel, PositiveFloat, PositiveInt, field_validator


class ProductoCreate(BaseModel):
    nombre: str
    precio: PositiveFloat
    id_categoría: PositiveInt

    model_config = {
        "json_schema_extra": {
            "example": {
                "nombre": "Mouse Logitech",
                "precio": 1999.99,
                "id_categoría": 1,
            }
        }
    }


class ProductoGet(BaseModel):
    id: PositiveInt
    nombre: str
    precio: PositiveFloat
    id_categoría: PositiveInt
    foto: Optional[Path] = None

    class Config:
        from_attributes = True
