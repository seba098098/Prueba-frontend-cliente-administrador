# Importación de los tipos de columnas y tipos ENUM de SQLAlchemy
from sqlalchemy import Column, Integer, String, Enum
from app.database import Base  # Importa la clase base declarativa común para todos los modelos
import enum  # Módulo para definir enumeraciones en Python

# Enumeración para los roles de usuario posibles
class UserRole(str, enum.Enum):
    admin = "admin"      # Usuario con rol de administrador
    externo = "externo"  # Usuario externo o con permisos limitados

# Definición del modelo de datos Usuario
class Usuario(Base):
    __tablename__ = "usuarios"  # Nombre de la tabla en la base de datos

    # ID único del usuario (clave primaria, tipo entero)
    id = Column(Integer, primary_key=True, index=True)

    # Correo electrónico del usuario (debe ser único, no puede ser nulo, indexado)
    email = Column(String, unique=True, index=True, nullable=False)

    # Contraseña cifrada del usuario (no puede ser nula)
    password = Column(String, nullable=False)

    # Rol del usuario, basado en la enumeración definida arriba. Por defecto es 'externo'
    role = Column(Enum(UserRole), default=UserRole.externo)
