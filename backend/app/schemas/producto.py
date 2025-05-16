from pydantic import BaseModel
from typing import Optional

# Esquema base para Producto con campos comunes para lectura y creación
class ProductoBase(BaseModel):
    codigo: str                     # Código único del producto
    nombre: str                     # Nombre del producto
    caracteristicas: Optional[str] = None  # Características o descripción (opcional)
    precio_usd: Optional[float] = None     # Precio en dólares (opcional)
    moneda: Optional[str] = None  # campo moneda opcional tipo string
    empresa_nit: str                # NIT de la empresa a la que pertenece el producto

# Esquema para creación de producto, hereda todos los campos de ProductoBase
class ProductoCreate(ProductoBase):
    pass  # No agrega campos adicionales, usa los definidos en ProductoBase

# Esquema para lectura de producto, incluye configuración para leer desde ORM
class ProductoRead(ProductoBase):
    class Config:
        # Permite crear instancias del esquema directamente desde objetos ORM (SQLAlchemy)
        from_attributes = True
