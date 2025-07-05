from datetime import timedelta
from pathlib import Path
import shutil
from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    status,
    Body,
    HTTPException,
)
from fastapi.responses import FileResponse
from pydantic import PositiveInt
from Database.generator import generate_db
from Esquemas.Categoría import CategoríaCreate, CategoríaGet
import os
from Servicios import CategoríaServicio
from auth.auth import obtener_usuario_admin_autenticado, obtener_usuario_autenticado

router = APIRouter()


@router.get("/", tags=["Categorías"], response_model=list[CategoríaGet])
def obtener_categorías(db=Depends(generate_db)) -> list[CategoríaGet]:
    categorías = CategoríaServicio.obtener_categorías(db)
    return [CategoríaGet.model_validate(u) for u in categorías]


@router.get("/{id}", tags=["Categorías"], response_model=CategoríaGet)
def obtener_categoría_por_id(id: PositiveInt, db=Depends(generate_db)) -> CategoríaGet:
    categoría = CategoríaServicio.obtener_categoría(id, db)
    if not categoría:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada"
        )
    return CategoríaGet.model_validate(categoría)


@router.post(
    "/",
    tags=["Categorías"],
    status_code=status.HTTP_201_CREATED,
    response_model=CategoríaGet,
)
def agregar_categoría(
    categoría: CategoríaCreate,
    db=Depends(generate_db),
    usuario=Depends(obtener_usuario_admin_autenticado),
):
    nuevo_categoría = CategoríaServicio.crear_categoría(categoría, db)
    if not nuevo_categoría:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible crear el categoría",
        )
    return CategoríaGet.model_validate(nuevo_categoría)


@router.put("/{id}", tags=["Categorías"], status_code=status.HTTP_204_NO_CONTENT)
def modificar_categoría(
    id: PositiveInt,
    categoría: CategoríaCreate = Body(),
    db=Depends(generate_db),
    usuario=Depends(obtener_usuario_admin_autenticado),
):
    obtener_categoría_por_id(id, db)
    ok = CategoríaServicio.modificar_categoría(id, categoría, db)
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible modificar el categoría",
        )


@router.delete("/{id}", tags=["Categorías"], status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoría(
    id: PositiveInt,
    db=Depends(generate_db),
    usuario=Depends(obtener_usuario_admin_autenticado),
):
    obtener_categoría_por_id(id, db)
    ok = CategoríaServicio.eliminar_categoría(id, db)
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible eliminar el categoría",
        )
