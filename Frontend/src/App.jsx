// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/pages/Login";
import Empresas from "./components/pages/Empresas";
import Productos from "./components/pages/Productos";
import Inventario from "./components/pages/Inventario";
import Usuarios from "./components/pages/Usuarios";
import LogoutButton from "./components/common/LogoutButton";
import PrediccionDemanda from "./components/PrediccionDemanda"; // Importa tu componente de predicción

// Nuevo menú con control para enlace Usuarios solo admin
function NavigationWithRoles() {
  const { role } = useAuth();
  return (
    <nav style={{ padding: "1rem", backgroundColor: "#ddd", marginBottom: 20 }}>
      <a href="/empresas" style={{ marginRight: 15 }}>Empresas</a>
      <a href="/productos" style={{ marginRight: 15 }}>Productos</a>
      <a href="/inventario" style={{ marginRight: 15 }}>Inventario</a>
      {role === "admin" && (
        <a href="/usuarios" style={{ marginRight: 15 }}>Usuarios</a>
      )}
      {/* Enlace a la predicción de demanda */}
      <a href="/prediccion" style={{ marginLeft: 15 }}>Predicción de Demanda</a>
    </nav>
  );
}

function PrivateRoute({ children, allowedRoles }) {
  const { user, role } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <p>No tienes permisos para acceder a esta página.</p>;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {user && (
        <>
          {/* Header con saludo y Logout */}
          <header style={{ padding: "1rem", backgroundColor: "#f5f5f5", display: "flex", justifyContent: "space-between" }}>
            <span>Bienvenido, {user.email}</span>
            <LogoutButton />
          </header>

          {/* Menú con control de roles */}
          <NavigationWithRoles />
        </>
      )}

      {/* Rutas de la aplicación */}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/empresas" /> : <Login />} />

        <Route
          path="/empresas"
          element={
            <PrivateRoute allowedRoles={["admin", "externo"]}>
              <Empresas />
            </PrivateRoute>
          }
        />

        <Route
          path="/productos"
          element={
            <PrivateRoute allowedRoles={["admin", "externo"]}>
              <Productos />
            </PrivateRoute>
          }
        />

        <Route
          path="/inventario"
          element={
            <PrivateRoute allowedRoles={["admin", "externo"]}>
              <Inventario />
            </PrivateRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Usuarios />
            </PrivateRoute>
          }
        />

        {/* Ruta para Predicción de Demanda */}
        <Route
          path="/prediccion"
          element={
            <PrivateRoute allowedRoles={["admin", "externo"]}>
              <PrediccionDemanda />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to={user ? "/empresas" : "/login"} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
