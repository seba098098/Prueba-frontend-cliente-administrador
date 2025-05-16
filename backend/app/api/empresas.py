from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.empresa import Empresa
from app.schemas.empresa import EmpresaCreate, EmpresaRead
from app.database import SessionLocal
from app.api.dependencies import get_current_admin

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/empresas", response_model=list[EmpresaRead])
def listar_empresas(db: Session = Depends(get_db)):
    empresas = db.query(Empresa).all()
    return empresas

@router.post("/empresas", response_model=EmpresaRead)
def crear_empresa(
    empresa: EmpresaCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    db_empresa = Empresa(**empresa.dict())
    db.add(db_empresa)
    try:
        db.commit()
        db.refresh(db_empresa)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="La empresa con ese NIT ya existe")
    return db_empresa

@router.put("/empresas/{nit}", response_model=EmpresaRead)
def actualizar_empresa(
    nit: str,
    empresa: EmpresaCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    db_empresa = db.query(Empresa).filter(Empresa.nit == nit).first()
    if not db_empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")

    # Actualizamos campos
    for key, value in empresa.dict().items():
        setattr(db_empresa, key, value)

    try:
        db.commit()
        db.refresh(db_empresa)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error actualizando la empresa")
    return db_empresa

@router.delete("/empresas/{nit}", status_code=204)
def eliminar_empresa(
    nit: str,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    empresa = db.query(Empresa).filter(Empresa.nit == nit).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
    db.delete(empresa)
    db.commit()
    return
