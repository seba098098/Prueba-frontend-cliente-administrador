// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, role } = useAuth();

  if (!user) {
    // No autenticado, redirige a login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Usuario no autorizado
    return <div style={{ padding: 20, color: "red" }}>
      No tienes permisos para acceder a esta página.
    </div>;
  }

  // Usuario autorizado, renderiza las rutas hijas
  return <Outlet />;
}
