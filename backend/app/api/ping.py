# Importación de APIRouter para definir rutas en FastAPI
from fastapi import APIRouter

# Crear una instancia de router para agrupar las rutas relacionadas
router = APIRouter()

# Ruta simple GET para verificar si el servicio está activo
@router.get("/ping")
async def ping():
    # Retorna una respuesta simple para pruebas de salud del servidor
    return {"message": "pong"}
