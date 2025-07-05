from pathlib import Path
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

import secrets
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from Database.generator import generate_db
from Esquemas.Usuario import UsuarioGet, Rol
from Servicios.UsuarioServicio import obtener_usuario_por_correo
from dotenv import load_dotenv
import os
from auth.seguridad import pwd_context


SECRET_KEY = os.getenv("SECRET_KEY", default="")
ALGORITHM = os.getenv("ALGORITHM", default="")

if not SECRET_KEY or not ALGORITHM:
    raise RuntimeError("No se han seteado las variables de entorno")

seguridad_oauth2 = OAuth2PasswordBearer("usuarios/token")


def obtener_usuario_autenticado(
    token: str = Depends(seguridad_oauth2), db: Session = Depends(generate_db)
) -> UsuarioGet:
    try:
        payload = jwt.decode(token, key=SECRET_KEY, algorithms=ALGORITHM)
    except JWTError:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail="Token no valido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales no validas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    usuario = obtener_usuario_por_correo(email, db)
    if not usuario:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail="Usuario ya no registrado con ese correo",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return UsuarioGet.model_validate(usuario)


def obtener_usuario_admin_autenticado(
    usuario: UsuarioGet = Depends(obtener_usuario_autenticado),
):
    if usuario.rol is not Rol.Administrador:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            detail="No tiene los permisos suficientes",
            headers={"WWW-Authenticate": "Bearer"},
        )


#


def crear_token_jwt(diccionario: dict, delta_expiración: Optional[timedelta] = None):
    to_encode = diccionario.copy()
    if delta_expiración:
        expira = datetime.now(timezone.utc) + delta_expiración
    else:
        expira = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expira})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def son_credenciales_correctas(
    input_email: str, email: str, input_contraseña: str, contraseña: str
):
    es_email_correcto = secrets.compare_digest(input_email, email)
    es_constraseña_correcta = pwd_context.verify(input_contraseña, contraseña)
    print(
        es_constraseña_correcta,
        es_email_correcto,
        input_email,
        email,
        input_contraseña,
        contraseña,
    )
    return es_email_correcto and es_constraseña_correcta
