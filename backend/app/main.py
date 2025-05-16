from fastapi import FastAPI
from contextlib import asynccontextmanager
import logging
from app.api import auth, empresas, productos, inventario, ping
from app.database import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app.main")

# Contexto de vida útil de la app para acciones de inicio y cierre
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Iniciando aplicación - creando tablas...")
    init_db()  # Crea las tablas si no existen antes de arrancar la app
    yield  # Aquí se ejecuta la app
    logger.info("Aplicación finalizada")

# Crear instancia FastAPI con título y lifespan definido
app = FastAPI(title="InventarioApp", lifespan=lifespan)

# Registrar routers de las distintas partes de la API
app.include_router(auth.router)
app.include_router(empresas.router)
app.include_router(productos.router)
app.include_router(inventario.router)
app.include_router(ping.router)
