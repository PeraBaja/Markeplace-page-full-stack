from typing import Optional
from pydantic import BaseModel, Field, PositiveInt, EmailStr, field_validator
from passlib.context import CryptContext
from pathlib import Path
from enum import StrEnum
from auth.seguridad import pwd_context


class Rol(StrEnum):
    Cliente = "cliente"
    Administrador = "administrador"


class UsuarioCreate(BaseModel):
    apellido_nombre: str
    contraseña: str = Field(min_length=8)
    país: str | None = None
    ciudad: str | None = None
    teléfono: str | None = None
    dirección_correo: EmailStr
    rol: Rol

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "apellido_nombre": "Ana Pérez",
                "contraseña": "Contraseña123",
                "país": "Argentina",
                "ciudad": "Córdoba",
                "teléfono": "+54 351 1234567",
                "dirección_correo": "ana@example.com",
                "rol": "cliente",
            }
        }

    @field_validator("contraseña")
    def validar_al_menos_una_letra_mayusculas(cls, valor: str):
        if valor.islower():
            raise ValueError("Debe contener al menos una letra mayuscula")
        return valor


class UsuarioGet(BaseModel):
    id: PositiveInt
    apellido_nombre: str
    país: str | None = None
    ciudad: str | None = None
    teléfono: str | None = None
    dirección_correo: EmailStr
    rol: Rol
    foto_perfil: Optional[Path] = None

    class Config:
        from_attributes = True
