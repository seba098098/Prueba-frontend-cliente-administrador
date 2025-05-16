# Importamos las clases necesarias desde SQLAlchemy y la base declarativa del proyecto
from sqlalchemy import Column, String
from app.database import Base

# Definición del modelo Empresa, que representa la tabla 'empresas' en la base de datos
class Empresa(Base):
    __tablename__ = "empresas"  # Nombre de la tabla en la base de datos

    # Columna 'nit' como clave primaria (Primary Key), de tipo String e indexada para búsquedas rápidas
    nit = Column(String, primary_key=True, index=True)

    # Columna 'nombre' de la empresa, no puede ser nula
    nombre = Column(String, nullable=False)

    # Columna 'direccion' de la empresa, puede ser nula
    direccion = Column(String)

    # Columna 'telefono' de la empresa, puede ser nula
    telefono = Column(String)
