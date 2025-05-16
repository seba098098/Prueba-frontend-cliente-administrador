from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.producto import Producto
from app.models.empresa import Empresa
from app.schemas.producto import ProductoCreate, ProductoRead
from app.database import SessionLocal
from app.api.dependencies import get_current_admin  # Control de acceso admin

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/productos", response_model=list[ProductoRead])
def listar_productos(db: Session = Depends(get_db)):
    productos = db.query(Producto).all()
    return productos

@router.post("/productos", response_model=ProductoRead)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    empresa = db.query(Empresa).filter(Empresa.nit == producto.empresa_nit).first()
    if not empresa:
        raise HTTPException(status_code=400, detail="La empresa especificada no existe")

    db_producto = Producto(**producto.dict())
    db.add(db_producto)
    try:
        db.commit()
        db.refresh(db_producto)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al crear el producto: código duplicado o datos inválidos")

    return db_producto

@router.put("/productos/{codigo}", response_model=ProductoRead)
def actualizar_producto(codigo: str, producto: ProductoCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    db_producto = db.query(Producto).filter(Producto.codigo == codigo).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    empresa = db.query(Empresa).filter(Empresa.nit == producto.empresa_nit).first()
    if not empresa:
        raise HTTPException(status_code=400, detail="La empresa especificada no existe")

    db_producto.nombre = producto.nombre
    db_producto.caracteristicas = producto.caracteristicas
    db_producto.precio_usd = producto.precio_usd
    db_producto.empresa_nit = producto.empresa_nit

    try:
        db.commit()
        db.refresh(db_producto)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al actualizar el producto: datos inválidos o duplicados")

    return db_producto

@router.delete("/productos/{codigo}", status_code=204)
def eliminar_producto(codigo: str, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    producto = db.query(Producto).filter(Producto.codigo == codigo).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    db.delete(producto)
    db.commit()
    return
