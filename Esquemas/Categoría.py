from pydantic import BaseModel, Field, PositiveInt, field_validator


class CategoríaGet(BaseModel):
    id: PositiveInt
    descripción: str = Field(min_length=1)

    @field_validator("descripción")
    def validar_descripción_en_blanco(cls, valor: str):
        if valor.isspace():
            raise ValueError("La descripción no debe estar vacía")
        return valor

    class Config:
        from_attributes = True


class CategoríaCreate(BaseModel):
    descripción: str = Field(min_length=1)

    model_config = {"json_schema_extra": {"example": {"descripción": "Periféricos"}}}
