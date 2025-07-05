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
from Esquemas.Producto import ProductoCreate, ProductoGet
import os
from Servicios import ProductoServicio
from auth.auth import obtener_usuario_admin_autenticado

router = APIRouter()


@router.get("/", tags=["Productos"], response_model=list[ProductoGet])
def obtener_productos(db=Depends(generate_db)) -> list[ProductoGet]:
    productos = ProductoServicio.obtener_productos(db)
    return [ProductoGet.model_validate(u) for u in productos]


@router.get("/{id}", tags=["Productos"], response_model=ProductoGet)
def obtener_producto_por_id(id: PositiveInt, db=Depends(generate_db)) -> ProductoGet:
    producto = ProductoServicio.obtener_producto(id, db)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado"
        )
    return ProductoGet.model_validate(producto)


@router.post(
    "/",
    tags=["Productos"],
    status_code=status.HTTP_201_CREATED,
    response_model=ProductoGet,
)
def agregar_producto(
    producto: ProductoCreate,
    db=Depends(generate_db),
    usuario=Depends(obtener_usuario_admin_autenticado),
):
    nuevo_producto = ProductoServicio.crear_producto(producto, db)
    if not nuevo_producto:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible crear el producto",
        )
    return ProductoGet.model_validate(nuevo_producto)


@router.post(
    "/subir-foto/{id}", tags=["Productos"], status_code=status.HTTP_201_CREATED
)
def subir_foto(
    id: int,
    foto: UploadFile = File(description="Imagen del producto"),
    db=Depends(generate_db),
    usuario=Depends(obtener_usuario_admin_autenticado),
):
    producto = obtener_producto_por_id(id, db)
    if not os.path.exists("ProductosFotos/"):
        os.mkdir("ProductosFotos/")
    if not foto.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible guardar la imagen",
        )
    ext = os.path.splitext(foto.filename)[1].lower()

    nombre_archivo = producto.nombre + ext
    ruta = Path(f"ProductosFotos/{nombre_archivo}")
    with open(ruta, "wb") as buffer:
        shutil.copyfileobj(foto.file, buffer)
    ProductoServicio.modificar_imagen(id, ruta, db)


@router.get("/obtener-foto/{id}", tags=["Productos"])
def obtener_foto_por_id(id: int, db=Depends(generate_db)):
    producto = obtener_producto_por_id(id, db)
    if not producto.foto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró la imagen",
        )
    return FileResponse(producto.foto)


@router.put("/{id}", tags=["Productos"], status_code=status.HTTP_204_NO_CONTENT)
def modificar_producto(
    id: PositiveInt,
    producto: ProductoCreate = Body(),
    db=Depends(generate_db),
    usuario=Depends(obtener_usuario_admin_autenticado),
):
    obtener_producto_por_id(id, db)
    ok = ProductoServicio.modificar_producto(id, producto, db)
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible modificar el producto",
        )


@router.delete("/{id}", tags=["Productos"], status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(
    id: PositiveInt,
    db=Depends(generate_db),
    usuario=Depends(obtener_usuario_admin_autenticado),
):
    obtener_producto_por_id(id, db)
    ok = ProductoServicio.eliminar_producto(id, db)
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible eliminar el producto",
        )
