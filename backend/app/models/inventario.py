# Importación de los componentes necesarios desde SQLAlchemy y la base declarativa del proyecto
from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

# Definición del modelo Inventario, que representa la tabla 'inventario' en la base de datos
class Inventario(Base):
    __tablename__ = "inventario"  # Nombre de la tabla en la base de datos

    # Identificador único del ítem de inventario (clave primaria e indexado)
    id = Column(Integer, primary_key=True, index=True)

    # Código del producto asociado, clave foránea que referencia a la columna 'codigo' de la tabla 'productos'
    producto_codigo = Column(String, ForeignKey("productos.codigo"))

    # NIT de la empresa asociada, clave foránea que referencia a la columna 'nit' de la tabla 'empresas'
    empresa_nit = Column(String, ForeignKey("empresas.nit"))

    # Cantidad disponible del producto en inventario
    cantidad = Column(Integer)
