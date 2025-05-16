// src/components/common/LogoutButton.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function LogoutButton() {
  const { logout, user } = useAuth();

  if (!user) return null; // No mostrar si no está logueado

  return (
    <button onClick={logout} style={{
       marginLeft: 30,fontSize: '14px',borderRadius: '30px', display: "flex",  marginTop: 5,
       padding: "7px 5px",       // tamaño más grande (altura y ancho)
       backgroundColor: "#a569bd", // verde bootstrap (verde agradable)
       color: "white",             // texto blanco para contraste
       border: "none",
       cursor: "pointer",
       transition: "background-color 0.3s ease",
       }}>
      Cerrar sesión
    </button>
  );
}
