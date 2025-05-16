from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from app.api import auth, empresas, productos, inventario, ping
from app.database import init_db
from app.api.email import router as email_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app.main")

origins = [
    "http://localhost:3000",  # URL de tu frontend React
    # Puedes agregar más orígenes si es necesario
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Iniciando aplicación - creando tablas...")
    init_db()
    yield
    logger.info("Aplicación finalizada")

app = FastAPI(title="InventarioApp", lifespan=lifespan)

# Agregar middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Permitir solo frontend React
    allow_credentials=True,
    allow_methods=["*"],          # Permitir todos los métodos HTTP
    allow_headers=["*"],          # Permitir todos los headers
)

app.include_router(auth.router)
app.include_router(empresas.router)
app.include_router(productos.router)
app.include_router(inventario.router)
app.include_router(ping.router)
app.include_router(email_router)
