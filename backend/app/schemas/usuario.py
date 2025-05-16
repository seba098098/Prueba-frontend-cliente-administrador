from pydantic import BaseModel, EmailStr
from enum import Enum

# Definición de roles de usuario como enumeración de cadenas
class UserRole(str, Enum):
    admin = "admin"     # Rol administrador
    externo = "externo" # Rol externo (usuario regular)

# Esquema base para usuario con campos comunes a lectura y creación
class UsuarioBase(BaseModel):
    email: EmailStr  # Correo electrónico validado
    role: UserRole   # Rol del usuario (admin o externo)

# Esquema para creación de usuario, incluye contraseña sin encriptar
class UsuarioCreate(UsuarioBase):
    password: str  # Contraseña sin encriptar que se recibe en la creación

# Esquema para lectura de usuario, incluye el ID generado por la base de datos
class UsuarioRead(UsuarioBase):
    id: int  # Identificador único del usuario

    class Config:
        # Permite instanciar el esquema desde objetos ORM (como SQLAlchemy)
        from_attributes = True
