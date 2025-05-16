// src/components/common/LogoutButton.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function LogoutButton() {
  const { logout, user } = useAuth();

  if (!user) return null; // No mostrar si no está logueado

  return (
    <button onClick={logout} style={{ marginLeft: 10 }}>
      Cerrar sesión
    </button>
  );
}
