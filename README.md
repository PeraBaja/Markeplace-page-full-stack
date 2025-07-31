
# Página de relojería

Este es un proyecto full-stack usando:

- **Python 3.13**
- **FastAPI** (v0.115.x)
- **Uvicorn** (v0.34.3)
- **SQLAlchemy** (v2.0.41)
- **mysql-connector-python** (v9.3.0)
- **Bootstrap**, **HTML**, **CSS**, y **JavaScript**
- **pydantic[email]**, **passlib[bcrypt]**, **python-multipart**, **PyJWT**

---

## Requisitos previos

- Tener **Python 3.13**


## Instalación
```bash
git clone https://github.com/PeraBaja/Markeplace-page-full-stack.git
cd Markeplace-page-full-stack
python3 -m pip install -r requirements.txt
```
## Construcción del proyecto

En desarrollo:

> Recuerda crear el archivo .env y agregarle la variable DATABASE_URL:

Ej:
```.env
DB_URL="mysql+mysqlconnector://tu_usario:contraseña@localhost:3306/nombre_bd"
SECRET_KEY = "tu secret key"
ALGORITHM = "tu algoritmo de hashing"
```

```bash
uvicorn main:app --reload
```

## ¿Por qué lo desarrollé?

- Esto fue parte de un trabajo práctico de la carrera. Quize llevarlo a un siguiente nivel incorporando algunas mejoras.

- Para practicar con el framework de fast api y su ecosistema.

- Para practicar el desarrollo fullstack
enfocandome en hacer endpoints robustos, con autenticación de usuario y administración de permisos por roless