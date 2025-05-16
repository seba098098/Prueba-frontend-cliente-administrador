# backend/app/schemas/empresa.py
from pydantic import BaseModel
from typing import Optional

# Esquema base para Empresa con los campos comunes para lectura y creación
class EmpresaBase(BaseModel):
    nit: str                    # Número de identificación tributaria (NIT)
    nombre: str                 # Nombre de la empresa
    direccion: Optional[str] = None  # Dirección (opcional)
    telefono: Optional[str] = None   # Teléfono (opcional)

# Esquema para creación de empresa, hereda todos los campos de EmpresaBase
class EmpresaCreate(EmpresaBase):
    pass  # No añade campos adicionales, usa los definidos en EmpresaBase

# Esquema para lectura de empresa, añade configuración para lectura desde ORM
class EmpresaRead(EmpresaBase):
    class Config:
        # Permite crear instancias de este esquema directamente desde modelos ORM (como SQLAlchemy)
        from_attributes = True
