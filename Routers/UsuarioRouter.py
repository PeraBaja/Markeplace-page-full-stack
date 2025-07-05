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
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import PositiveInt
from Database.generator import generate_db
from Esquemas.Usuario import Rol, UsuarioCreate, UsuarioGet
from Esquemas.AccessToken import AccessTokenGet
import os
from Servicios import UsuarioServicio
from auth.auth import (
    crear_token_jwt,
    obtener_usuario_admin_autenticado,
    obtener_usuario_autenticado,
    son_credenciales_correctas,
)

router = APIRouter()
oauth_scheme = OAuth2PasswordBearer("usuarios/token")


@router.post("/token", tags=["auth"], response_model=AccessTokenGet)
def iniciar_sesion(
    credenciales: OAuth2PasswordRequestForm = Depends(),
    db=Depends(generate_db),
):
    print(credenciales.password, credenciales.username)
    usuario_model = UsuarioServicio.obtener_usuario_por_correo(
        credenciales.username, db
    )
    if not usuario_model:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrecta",
            headers={"WWW-Authenticate": "Bearer"},
        )
    usuario = UsuarioCreate.model_validate(usuario_model)
    if not son_credenciales_correctas(
        credenciales.username,
        usuario.dirección_correo,
        credenciales.password,
        usuario.contraseña,
    ):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrecta",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = crear_token_jwt(
        diccionario={"sub": credenciales.username, "rol": usuario.rol},
        delta_expiración=timedelta(minutes=30),
    )
    return {"access_token": token, "token_type": "bearer"}


@router.get("/", tags=["Usuarios"], response_model=list[UsuarioGet])
def obtener_usuarios(db=Depends(generate_db)) -> list[UsuarioGet]:
    usuarios = UsuarioServicio.obtener_usuarios(db)
    return [UsuarioGet.model_validate(u) for u in usuarios]


@router.get("/yo", tags=["Usuarios"], response_model=UsuarioGet)
def obtener_usuario_autenticado_endpoint(
    usuario: UsuarioGet = Depends(obtener_usuario_autenticado),
) -> UsuarioGet:
    return usuario


@router.get("/{id}", tags=["Usuarios"], response_model=UsuarioGet)
def obtener_usuario_por_id(id: PositiveInt, db=Depends(generate_db)) -> UsuarioGet:
    usuario = UsuarioServicio.obtener_usuario(id, db)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado"
        )
    return UsuarioGet.model_validate(usuario)


@router.post(
    "/",
    tags=["Usuarios"],
    status_code=status.HTTP_201_CREATED,
    response_model=UsuarioGet,
)
def agregar_usuario(
    usuario: UsuarioCreate,
    db=Depends(generate_db),
    usuario_admin=Depends(obtener_usuario_admin_autenticado),
):
    nuevo_usuario = UsuarioServicio.crear_usuario(usuario, db)
    if not nuevo_usuario:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible crear el usuario",
        )
    return UsuarioGet.model_validate(nuevo_usuario)


@router.post(
    "/registrarse",
    tags=["Usuarios"],
    status_code=status.HTTP_201_CREATED,
    response_model=UsuarioGet,
)
def registrar_cliente(usuario: UsuarioCreate, db=Depends(generate_db)):
    # Me aseguro de que solo puedan registrarse usuarios como clientes. Sujeto a cambios por una mejor solución
    usuario.rol = Rol.Cliente
    nuevo_usuario = UsuarioServicio.crear_usuario(usuario, db)
    if not nuevo_usuario:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible crear el usuario",
        )
    return UsuarioGet.model_validate(nuevo_usuario)


@router.post("/subir-foto/yo", tags=["Usuarios"], status_code=status.HTTP_201_CREATED)
def subir_foto_perfil_usuario_autenticado(
    foto_perfil: UploadFile = File(description="Imagen del usuario"),
    db=Depends(generate_db),
    usuario: UsuarioGet = Depends(obtener_usuario_autenticado),
):
    usuario = obtener_usuario_por_id(usuario.id, db)
    if not os.path.exists("UsuariosFotosPerfiles/"):
        os.mkdir("UsuariosFotosPerfiles/")
    if not foto_perfil.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible guardar la imagen",
        )
    ext = os.path.splitext(foto_perfil.filename)[1].lower()

    nombre_archivo = (
        usuario.dirección_correo.replace("@", "_at_").replace(".", "_") + ext
    )
    ruta = Path(f"UsuariosFotosPerfiles/{nombre_archivo}")
    with open(ruta, "wb") as buffer:
        shutil.copyfileobj(foto_perfil.file, buffer)
    UsuarioServicio.modificar_imagen(usuario.id, ruta, db)


@router.post("/subir-foto/{id}", tags=["Usuarios"], status_code=status.HTTP_201_CREATED)
def subir_foto_perfil(
    id: PositiveInt,
    foto_perfil: UploadFile = File(description="Imagen del usuario"),
    db=Depends(generate_db),
    usuario_autenticado: UsuarioGet = Depends(obtener_usuario_admin_autenticado),
):
    usuario = obtener_usuario_por_id(id, db)
    if not os.path.exists("UsuariosFotosPerfiles/"):
        os.mkdir("UsuariosFotosPerfiles/")
    if not foto_perfil.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible guardar la imagen",
        )
    ext = os.path.splitext(foto_perfil.filename)[1].lower()

    nombre_archivo = (
        usuario.dirección_correo.replace("@", "_at_").replace(".", "_") + ext
    )
    ruta = Path(f"UsuariosFotosPerfiles/{nombre_archivo}")
    with open(ruta, "wb") as buffer:
        shutil.copyfileobj(foto_perfil.file, buffer)
    UsuarioServicio.modificar_imagen(id, ruta, db)


@router.get("/obtener-foto/", tags=["Usuarios"])
def obtener_foto_por_usuario_autenticado(
    id: int,
    db=Depends(generate_db),
    usuario: UsuarioGet = Depends(obtener_usuario_autenticado),
):
    if not usuario.foto_perfil:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró la imagen",
        )
    return FileResponse(usuario.foto_perfil)


@router.get("/obtener-foto/{id}", tags=["Usuarios"])
def obtener_foto_por_id(id: int, db=Depends(generate_db)):
    usuario = obtener_usuario_por_id(id, db)
    if not usuario.foto_perfil:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró la imagen",
        )
    return FileResponse(usuario.foto_perfil)


@router.put("/{id}", tags=["Usuarios"], status_code=status.HTTP_204_NO_CONTENT)
def modificar_usuario(
    id: PositiveInt,
    usuario: UsuarioCreate = Body(),
    db=Depends(generate_db),
    usuario_autenticado: UsuarioGet = Depends(obtener_usuario_autenticado),
):
    obtener_usuario_por_id(id, db)
    es_admin = usuario_autenticado.rol is Rol.Administrador
    if usuario_autenticado.id != id and not es_admin:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "No tienes el permiso para modificar este usuario",
        )

    usuario.rol = Rol.Cliente if not es_admin else usuario.rol
    ok = UsuarioServicio.modificar_usuario(id, usuario, db)
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible modificar el usuario",
        )


@router.delete("/{id}", tags=["Usuarios"], status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(
    id: PositiveInt,
    db=Depends(generate_db),
    usuario=Depends(obtener_usuario_admin_autenticado),
):
    obtener_usuario_por_id(id, db)
    ok = UsuarioServicio.eliminar_usuario(id, db)
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fue posible eliminar el usuario",
        )
