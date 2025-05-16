from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.inventario import Inventario
from app.models.producto import Producto
from app.models.empresa import Empresa
from app.schemas.inventario import InventarioCreate, InventarioRead
from app.database import SessionLocal
from app.api.dependencies import get_current_admin  # Validación admin

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/inventario", response_model=list[InventarioRead])
def listar_inventario(db: Session = Depends(get_db)):
    inventarios = db.query(Inventario).all()
    return inventarios

@router.post("/inventario", response_model=InventarioRead)
def crear_inventario(item: InventarioCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    producto = db.query(Producto).filter(Producto.codigo == item.producto_codigo).first()
    if not producto:
        raise HTTPException(status_code=400, detail="El producto especificado no existe")

    empresa = db.query(Empresa).filter(Empresa.nit == item.empresa_nit).first()
    if not empresa:
        raise HTTPException(status_code=400, detail="La empresa especificada no existe")

    db_item = Inventario(**item.dict())
    db.add(db_item)
    try:
        db.commit()
        db.refresh(db_item)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al crear inventario: datos inválidos o duplicados")

    return db_item

@router.put("/inventario/{item_id}", response_model=InventarioRead)
def actualizar_inventario(
    item_id: int,
    item: InventarioCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    db_item = db.query(Inventario).filter(Inventario.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item de inventario no encontrado")

    producto = db.query(Producto).filter(Producto.codigo == item.producto_codigo).first()
    if not producto:
        raise HTTPException(status_code=400, detail="El producto especificado no existe")

    empresa = db.query(Empresa).filter(Empresa.nit == item.empresa_nit).first()
    if not empresa:
        raise HTTPException(status_code=400, detail="La empresa especificada no existe")

    db_item.producto_codigo = item.producto_codigo
    db_item.empresa_nit = item.empresa_nit
    db_item.cantidad = item.cantidad

    try:
        db.commit()
        db.refresh(db_item)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al actualizar inventario: datos inválidos o duplicados")

    return db_item

@router.delete("/inventario/{item_id}", status_code=204)
def eliminar_inventario(item_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(Inventario).filter(Inventario.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item de inventario no encontrado")

    db.delete(item)
    db.commit()
    return
