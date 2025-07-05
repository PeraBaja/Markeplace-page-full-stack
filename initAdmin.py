from Config.database import SessionLocal
from Esquemas.Usuario import UsuarioCreate, Rol
from Database.generator import generate_db
from sqlalchemy.orm import Session
from Modelos.UsuarioModelo import UsuarioModelo
from auth.seguridad import pwd_context  # o donde tengas definido CryptContext


def crear_admin_inicial():
    db: Session = SessionLocal()
    # Verificar si ya existe un admin
    admin_existente = (
        db.query(UsuarioModelo).filter(UsuarioModelo.rol == Rol.Administrador).first()
    )
    if admin_existente:
        print("Ya existe un administrador. Abortando.")
        return

    # Datos del admin inicial
    datos_admin = UsuarioCreate(
        apellido_nombre="Benjamín Peralta",
        contraseña=pwd_context.hash("Admin123"),
        país="Argentina",
        ciudad="Buenos Aires",
        teléfono="+54 11 12345678",
        dirección_correo="admin@example.com",
        rol=Rol.Administrador,
    )

    nuevo_admin = UsuarioModelo(**datos_admin.model_dump())

    db.add(nuevo_admin)
    db.commit()
    db.close()
    print("Administrador creado con éxito.")


if __name__ == "__main__":
    crear_admin_inicial()
