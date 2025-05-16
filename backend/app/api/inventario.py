# Importaciones necesarias de FastAPI y SQLAlchemy
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

# Importación de modelos y esquemas
from app.models.inventario import Inventario
from app.models.producto import Producto
from app.models.empresa import Empresa
from app.schemas.inventario import InventarioCreate, InventarioRead
from app.database import SessionLocal

# Creación del enrutador para los endpoints relacionados con el inventario
router = APIRouter()

# Dependencia que proporciona una sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint GET que retorna una lista de todos los registros en el inventario
@router.get("/inventario", response_model=list[InventarioRead])
def listar_inventario(db: Session = Depends(get_db)):
    inventarios = db.query(Inventario).all()
    return inventarios

# Endpoint POST para crear un nuevo registro de inventario
@router.post("/inventario", response_model=InventarioRead)
def crear_inventario(item: InventarioCreate, db: Session = Depends(get_db)):
    # Validación: comprobar que el producto especificado existe
    producto = db.query(Producto).filter(Producto.codigo == item.producto_codigo).first()
    if not producto:
        raise HTTPException(status_code=400, detail="El producto especificado no existe")

    # Validación: comprobar que la empresa especificada existe
    empresa = db.query(Empresa).filter(Empresa.nit == item.empresa_nit).first()
    if not empresa:
        raise HTTPException(status_code=400, detail="La empresa especificada no existe")

    # Crear el objeto de inventario a partir de los datos recibidos
    db_item = Inventario(**item.dict())
    db.add(db_item)
    try:
        # Intentar guardar el nuevo registro en la base de datos
        db.commit()
        db.refresh(db_item)
    except IntegrityError:
        # Si hay un error de integridad (datos inválidos o duplicados), hacer rollback
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al crear inventario: datos inválidos o duplicados")

    return db_item

# Endpoint DELETE para eliminar un registro del inventario según su ID
@router.delete("/inventario/{item_id}", status_code=204)
def eliminar_inventario(item_id: int, db: Session = Depends(get_db)):
    # Buscar el ítem por su ID
    item = db.query(Inventario).filter(Inventario.id == item_id).first()
    if not item:
        # Si no se encuentra el ítem, retornar error 404
        raise HTTPException(status_code=404, detail="Item de inventario no encontrado")

    # Eliminar el ítem de la base de datos
    db.delete(item)
    db.commit()
    return  # Código 204: operación exitosa sin contenido en la respuesta
