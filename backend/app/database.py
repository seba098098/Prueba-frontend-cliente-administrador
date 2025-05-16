from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
import logging

load_dotenv()  # Carga las variables de entorno desde el archivo .env

# Obtiene las variables de entorno para la conexión a PostgreSQL con valores por defecto
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "admin")
POSTGRES_DB = os.getenv("POSTGRES_DB", "inventario_db")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "192.168.20.26")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5433")  # Puerto que coincide con docker-compose

# Construye la URL de conexión para SQLAlchemy usando el driver postgresql
SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

# Crea el motor de base de datos para SQLAlchemy
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Crea una fábrica de sesiones para interactuar con la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crea una clase base para los modelos declarativos de SQLAlchemy
Base = declarative_base()

# Configura el logging para mostrar información en consola
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    # Importa los modelos para que SQLAlchemy pueda registrar sus tablas
    from app.models import usuario, empresa, producto, inventario
    logger.info("Creando tablas en la base de datos...")
    # Crea todas las tablas definidas en los modelos si no existen
    Base.metadata.create_all(bind=engine)
    logger.info("Tablas creadas correctamente")
