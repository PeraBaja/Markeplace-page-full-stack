from datetime import timedelta
from pathlib import Path
import shutil
from fastapi import (
    APIRouter,
    Depends,
    File,
    Query,
    UploadFile,
    status,
    Body,
    HTTPException,
)
from fastapi.responses import FileResponse
from pydantic import PositiveInt
from Database.generator import generate_db
from Esquemas.Usuario import UsuarioGet
from Esquemas.Venta import VentaCreate, VentaGet
import os
from auth.auth import obtener_usuario_autenticado, obtener_usuario_admin_autenticado
from Servicios import VentaServicio

router = APIRouter()


@router.get("/", tags=["Ventas"], response_model=list[VentaGet])
def obtener_ventas_por_despachados(
    despachado: bool | None = None,
    db=Depends(generate_db),
    usuario=Depends(obtener_usuario_admin_autenticado),
) -> list[VentaGet]:
    if despachado is None:
        ventas = VentaServicio.obtener_ventas(db)
    else:
        ventas = VentaServicio.obtener_ventas_por_despachados(despachado, db)
    return [VentaGet.model_validate(u) for u in ventas]


@router.get("/yo", tags=["Ventas"], response_model=list[VentaGet])
def obtener_ventas_por_usuario_autenicado(
    db=Depends(generate_db),
    usuario=Depends(obtener_usuario_autenticado),
) -> list[VentaGet]:
    ventas = VentaServicio.obtener_ventas(db)
    return [VentaGet.model_validate(u) for u in ventas]


@router.get("/{id}", tags=["Ventas"], response_model=VentaGet)
def obtener_venta_por_id(
    id: PositiveInt,
    db=Depends(generate_db),
    usuario=Depends(obtener_usuario_admin_autenticado),
) -> VentaGet:
    venta = VentaServicio.obtener_venta(id, db)
    if not venta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Venta no encontrado"
        )
    return VentaGet.model_validate(venta)


@router.post(
    "/yo", tags=["Ventas"], status_code=status.HTTP_201_CREATED, response_model=VentaGet
)
def agregar_compra_de_usuario_autenticado(
    venta: VentaCreate,
    db=Depends(generate_db),
    usuario: UsuarioGet = Depends(obtener_usuario_autenticado),
):
    venta.id_usuario = usuario.id
    nueva_venta = VentaServicio.crear_venta(venta, db)
    if not nueva_venta:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible crear la venta",
        )
    return VentaGet.model_validate(nueva_venta)


@router.put("/{id}", tags=["Ventas"], status_code=status.HTTP_204_NO_CONTENT)
def modificar_venta(
    id: PositiveInt, venta: VentaCreate = Body(), db=Depends(generate_db)
):
    obtener_venta_por_id(id, db)
    ok = VentaServicio.modificar_venta(id, venta, db)
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible modificar la venta",
        )


@router.patch("/{id}", tags=["Ventas"], status_code=status.HTTP_204_NO_CONTENT)
def marcar_como_despachado(
    id: int,
    despachado: bool = Body(...),
    db=Depends(generate_db),
    usuario=Depends(obtener_usuario_admin_autenticado),
):
    obtener_venta_por_id(id, db)
    ok = VentaServicio.marcar_venta_como_despachada(id, despachado, db)
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible marcar la venta como despachada",
        )
