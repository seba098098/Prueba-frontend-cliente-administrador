# Importación de clases y funciones necesarias de FastAPI y SQLAlchemy
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

# Importación de modelos y esquemas utilizados
from app.models.producto import Producto
from app.models.empresa import Empresa
from app.schemas.producto import ProductoCreate, ProductoRead
from app.database import SessionLocal

# Creación del router para agrupar rutas relacionadas con productos
router = APIRouter()

# Dependencia para obtener una sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Ruta GET para listar todos los productos
@router.get("/productos", response_model=list[ProductoRead])
def listar_productos(db: Session = Depends(get_db)):
    # Consulta todos los productos en la base de datos
    productos = db.query(Producto).all()
    return productos

# Ruta POST para crear un nuevo producto
@router.post("/productos", response_model=ProductoRead)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    # Validar que la empresa asociada al producto exista
    empresa = db.query(Empresa).filter(Empresa.nit == producto.empresa_nit).first()
    if not empresa:
        raise HTTPException(status_code=400, detail="La empresa especificada no existe")

    # Crear una instancia del modelo Producto con los datos recibidos
    db_producto = Producto(**producto.dict())
    db.add(db_producto)
    try:
        db.commit()           # Guardar cambios en la base de datos
        db.refresh(db_producto)  # Refrescar la instancia para obtener ID y otros campos generados
    except IntegrityError:
        db.rollback()         # Revertir los cambios en caso de error
        raise HTTPException(status_code=400, detail="Error al crear el producto: código duplicado o datos inválidos")

    return db_producto

# Ruta DELETE para eliminar un producto por su código
@router.delete("/productos/{codigo}", status_code=204)
def eliminar_producto(codigo: str, db: Session = Depends(get_db)):
    # Buscar el producto por su código
    producto = db.query(Producto).filter(Producto.codigo == codigo).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Eliminar el producto de la base de datos
    db.delete(producto)
    db.commit()
    return  # 204 No Content: no se retorna cuerpo
