# backend/app/api/empresas.py

# Importación de herramientas necesarias de FastAPI y SQLAlchemy
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

# Importación de modelos y esquemas relacionados con Empresa
from app.models.empresa import Empresa
from app.schemas.empresa import EmpresaCreate, EmpresaRead
from app.database import SessionLocal

# Inicialización del enrutador para las rutas relacionadas con empresas
router = APIRouter()

# Dependencia que gestiona la sesión de base de datos y asegura su cierre
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint GET que devuelve una lista de todas las empresas registradas
@router.get("/empresas", response_model=list[EmpresaRead])
def listar_empresas(db: Session = Depends(get_db)):
    empresas = db.query(Empresa).all()
    return empresas

# Endpoint POST que permite crear una nueva empresa
@router.post("/empresas", response_model=EmpresaRead)
def crear_empresa(empresa: EmpresaCreate, db: Session = Depends(get_db)):
    # Crear una instancia del modelo Empresa usando los datos del esquema recibido
    db_empresa = Empresa(**empresa.dict())
    db.add(db_empresa)
    try:
        # Intentar guardar la nueva empresa en la base de datos
        db.commit()
        db.refresh(db_empresa)
    except IntegrityError:
        # En caso de error de integridad (por ejemplo, NIT duplicado), hacer rollback
        db.rollback()
        raise HTTPException(status_code=400, detail="La empresa con ese NIT ya existe")
    return db_empresa

# Endpoint DELETE que permite eliminar una empresa usando su NIT
@router.delete("/empresas/{nit}", status_code=204)
def eliminar_empresa(nit: str, db: Session = Depends(get_db)):
    # Buscar la empresa por su NIT
    empresa = db.query(Empresa).filter(Empresa.nit == nit).first()
    if not empresa:
        # Si no se encuentra, lanzar una excepción 404
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
    # Eliminar la empresa de la base de datos
    db.delete(empresa)
    db.commit()
    return  # Código 204: operación exitosa sin contenido en la respuesta
