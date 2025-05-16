from pydantic import BaseModel
from typing import Optional

# Esquema base para Inventario con campos comunes para lectura y creación
class InventarioBase(BaseModel):
    producto_codigo: str         # Código del producto asociado al inventario
    empresa_nit: str             # NIT de la empresa asociada
    cantidad: Optional[int] = 0  # Cantidad disponible, por defecto 0 (opcional)

# Esquema para creación de inventario, hereda los campos de InventarioBase
class InventarioCreate(InventarioBase):
    pass  # No agrega campos adicionales, usa los de InventarioBase

# Esquema para lectura de inventario que incluye el ID único
class InventarioRead(InventarioBase):
    id: int  # ID único del registro en inventario

    class Config:
        # Permite crear instancias del esquema a partir de objetos ORM (como SQLAlchemy)
        from_attributes = True
