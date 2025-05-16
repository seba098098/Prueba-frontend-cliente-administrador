import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LayoutDashboard from "../layout/LayoutDashboard";
import Login from "../pages/Login";
import Empresas from "../pages/Empresas";
import Productos from "../pages/Productos";
import Inventario from "../pages/Inventario";
import Usuarios from "../pages/Usuarios";
import ProtectedRoute from "../common/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "externo"]}>
            <LayoutDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="empresas" element={<Empresas />} />
        <Route path="productos" element={<Productos />} />
        <Route path="inventario" element={<Inventario />} />
        <Route
          path="usuarios"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard/empresas" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
