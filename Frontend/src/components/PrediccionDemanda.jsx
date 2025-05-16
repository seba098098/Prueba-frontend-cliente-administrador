import React, { useEffect, useState } from 'react';

function PrediccionDemanda() {
  const [prediccion, setPrediccion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hacer la solicitud a la API FastAPI
    fetch('http://localhost:8000/predict_demand')
      .then((response) => response.json())
      .then((data) => {
        setPrediccion(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Predicción de Demanda</h2>
      <p><strong>Producto:</strong> {prediccion.producto}</p>
      <p><strong>Empresa:</strong> {prediccion.empresa}</p>
      <p><strong>Precio:</strong> {prediccion.precio_usd} USD</p>
      <p><strong>Demanda Predicha:</strong> {prediccion.predicted_demand} unidades</p>
      <p><strong>Moneda Más Demandada:</strong> {prediccion.moneda_mas_demandada}</p>
    </div>
  );
}

export default PrediccionDemanda;
