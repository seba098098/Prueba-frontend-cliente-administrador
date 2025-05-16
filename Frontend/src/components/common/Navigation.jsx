import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  return (
    <nav style={{ padding: "1rem", backgroundColor: "#ddd", marginBottom: 20 }}>
      <Link to="/empresas" style={{ marginRight: 15 }}>
        Empresas
      </Link>
      <Link to="/productos" style={{ marginRight: 15 }}>
        Productos
      </Link>
      {/* Puedes agregar más enlaces aquí */}
    </nav>
  );
}
