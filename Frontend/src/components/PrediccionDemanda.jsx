// src/components/PrediccionDemanda.jsx
import React, { useState, useEffect } from 'react';

function PrediccionDemanda() {
  const [prediccion, setPrediccion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/predict_demand')  // Asume que la API de FastAPI está corriendo en localhost
      .then(response => response.json())
      .then(data => {
        setPrediccion(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-10">Cargando...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-200 min-h-screen py-6">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-4xl font-semibold text-center text-blue-600 mb-8 tracking-wide">Predicción de Demanda</h2>

        {/* Contenedor de predicción */}
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-lg text-gray-700"><strong>Producto:</strong> {prediccion.producto}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-lg text-gray-700"><strong>Empresa:</strong> {prediccion.empresa}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-lg text-gray-700"><strong>Precio:</strong> {prediccion.precio_usd} USD</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-lg text-gray-700"><strong>Demanda Predicha:</strong> {prediccion.predicted_demand} unidades</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-lg text-gray-700"><strong>Moneda Más Demandada:</strong> {prediccion.moneda_mas_demandada}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrediccionDemanda;
