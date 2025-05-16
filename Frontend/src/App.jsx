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
    <nav style={{ padding: "1rem", backgroundColor: "#d6eaf8", marginBottom: 15, display: "flex",justifyContent: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",borderRadius: '30px'
      }}>
        <img src="/logo192.png" alt="Descripción de la imagen" style={{ width: "40px", height: "40px" , marginRight: 27}} />

      <a href="/empresas" style={{ marginRight: 27,color: "#007bff" }}>Empresas</a>
      <a href="/productos" style={{ marginRight: 27,color: "#007bff" }}>Productos</a>
      <a href="/inventario" style={{ marginRight: 27,color: "#007bff" }}>Inventario</a>
      {role === "admin" && (
        <a href="/usuarios" style={{ marginRight: 20 ,color: "#007bff" }}>Usuarios</a>
      )}
      {/* Enlace a la predicción de demanda */}
      <a href="/prediccion" style={{ marginLeft: 20,color: "#007bff" }}>Predicción de Demanda</a>
      <img src="/logo192.png" alt="Descripción de la imagen" style={{ width: "40px", height: "40px", marginLeft: 20 }} />
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
          <header style={{ padding: "1rem",borderRadius: '30px',fontWeight: '700', backgroundColor: "  #76d7c4 ", display: "flex", justifyContent: "space-between" }}>
            <span>Bienvenido, {user.email}</span>
            <span>Esta es su pagina empresarial</span>
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

