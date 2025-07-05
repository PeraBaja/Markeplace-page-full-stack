from contextlib import contextmanager
from Config.database import SessionLocal
from sqlalchemy.orm import Session
from typing import Iterator


def generate_db() -> Iterator[Session]:
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()
