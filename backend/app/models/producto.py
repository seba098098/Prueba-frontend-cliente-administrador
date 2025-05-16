# Importación de los tipos de columnas y claves foráneas desde SQLAlchemy
from sqlalchemy import Column, String, Float, ForeignKey
from app.database import Base

# Definición del modelo Producto, que representa la tabla 'productos' en la base de datos
class Producto(Base):
    __tablename__ = "productos"  # Nombre de la tabla en la base de datos

    # Código único del producto (clave primaria e indexado)
    codigo = Column(String, primary_key=True, index=True)

    # Nombre del producto (no puede ser nulo)
    nombre = Column(String, nullable=False)

    # Características del producto (campo opcional)
    caracteristicas = Column(String)

    # Precio del producto en dólares (tipo flotante)
    precio_usd = Column(Float)
    
    moneda = Column(String, nullable=True)  # campo moneda tipo string, opcional


    # NIT de la empresa que fabrica o distribuye el producto (clave foránea que referencia a 'empresas.nit')
    empresa_nit = Column(String, ForeignKey("empresas.nit"))
