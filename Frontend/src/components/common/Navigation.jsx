import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navigation() {
  const { role } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center shadow-lg">
      <div className="text-white text-xl font-semibold">
        <Link to="/">InventarioApp</Link>
      </div>
      <div className="space-x-4">
        <Link
          to="/empresas"
          className="text-white hover:text-yellow-300 transition-colors duration-300"
        >
          Empresas
        </Link>
        <Link
          to="/productos"
          className="text-white hover:text-yellow-300 transition-colors duration-300"
        >
          Productos
        </Link>
        <Link
          to="/inventario"
          className="text-white hover:text-yellow-300 transition-colors duration-300"
        >
          Inventario
        </Link>
        {role === "admin" && (
          <Link
            to="/usuarios"
            className="text-white hover:text-yellow-300 transition-colors duration-300"
          >
            Usuarios
          </Link>
        )}
        <Link
          to="/prediccion"
          className="text-white hover:text-yellow-300 transition-colors duration-300"
        >
          Predicción de Demanda
        </Link>
      </div>
    </nav>
  );
}
