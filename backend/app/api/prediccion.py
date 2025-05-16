from fastapi import APIRouter
from sklearn.linear_model import LinearRegression
import pandas as pd
import psycopg2
from fastapi.responses import JSONResponse
from collections import Counter

router = APIRouter()

# Función para obtener los datos de la base de datos PostgreSQL
def get_data():
    conn = psycopg2.connect(
        dbname="inventario_db",
        user="postgres",
        password="admin",
        host="localhost",  # Conexión con el puerto 5433
        port="5433"
    )
    query = """
    SELECT p.nombre AS producto, 
           i.cantidad AS total_inventario, 
           p.precio_usd, 
           e.nombre AS empresa,
           p.moneda
    FROM productos p
    JOIN inventario i ON p.codigo = i.producto_codigo
    JOIN empresas e ON e.nit = p.empresa_nit;
    """
    df = pd.read_sql(query, conn)
    return df

# Ruta para obtener la predicción de demanda
@router.get("/predict_demand")
def predict_demand():
    df = get_data()

    # Variables de predicción
    X = df[['precio_usd']]  # Precio como variable independiente
    y = df['total_inventario']  # Total de inventario como variable dependiente

    # Modelo de regresión lineal
    model = LinearRegression()
    model.fit(X, y)

    # Predicción de demanda para un precio de 100 USD
    predicted_demand = model.predict([[100]])

    # Calcular la moneda más demandada (más productos en esa moneda)
    currency_count = Counter(df['moneda'])
    most_common_currency = currency_count.most_common(1)[0][0]  # Obtenemos la moneda más frecuente

    # Obtener el producto y la empresa correspondiente a la predicción
    result = {
        "predicted_demand": predicted_demand[0],
        "producto": df.iloc[0]['producto'],
        "empresa": df.iloc[0]['empresa'],
        "precio_usd": 100,
        "moneda_mas_demandada": most_common_currency
    }

    # Retornar la predicción junto con los detalles de producto, empresa y moneda
    return JSONResponse(content=result)
