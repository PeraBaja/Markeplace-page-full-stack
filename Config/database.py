from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, DeclarativeMeta
import os

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

query_connection: str = os.environ.get("DB_URL", default="")

engine = create_engine(query_connection)

Base: DeclarativeMeta = declarative_base()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
