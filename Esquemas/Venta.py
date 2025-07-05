from pydantic import BaseModel, PositiveInt


class VentaGet(BaseModel):
    id: PositiveInt
    id_producto: PositiveInt
    id_usuario: PositiveInt
    cantidad: PositiveInt
    despachado: bool

    class Config:
        from_attributes = True


class VentaCreate(BaseModel):
    id_producto: PositiveInt
    id_usuario: PositiveInt | None = None
    cantidad: PositiveInt
    despachado: bool

    model_config = {
        "json_schema_extra": {
            "example": {
                "id_producto": 1,
                "id_usuario": 2,
                "cantidad": 3,
                "despachado": False,
            }
        }
    }
