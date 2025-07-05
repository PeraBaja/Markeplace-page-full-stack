from fastapi import FastAPI
from fastapi import Depends
from Database.generator import generate_db
from Routers import ProductoRouter, CategoríaRouter, VentaRouter, UsuarioRouter
from auth.auth import obtener_usuario_autenticado
from Config.database import Base, engine
from sqlalchemy.orm import Session
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.title = "Trabajo práctico NRO 2"
app.version = "0.0.∞"

Base.metadata.create_all(engine)

app.router.include_router(ProductoRouter.router, prefix="/productos")
app.router.include_router(CategoríaRouter.router, prefix="/categorias")
app.router.include_router(UsuarioRouter.router, prefix="/usuarios")
app.router.include_router(VentaRouter.router, prefix="/ventas")

app.mount(
    "/f", StaticFiles(directory="./marketplace-page-main", html=True), name="frontend"
)
