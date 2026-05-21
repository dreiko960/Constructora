from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True  # Helpful for database connection stability
)

try:
    # Test connection on startup
    with engine.connect() as connection:
        print("Conexión a la base de datos 'grupo_ipurre_eirl' exitosa.")
except Exception as e:
    print(f"Error al conectar con la base de datos: {e}")
    print("Verifique que el servidor MySQL esté corriendo y que las credenciales en .env sean correctas.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
