// src/components/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login, error, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  if (user) {
    return <p>Has iniciado sesión como {user.email}</p>;
  }

  return (
    <div style={{ maxWidth: 200, margin: "auto", padding: 30 ,textAlign: "center", marginTop: 80  }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            style={{
                marginBottom: "5px",  // separación abajo
                padding: "5px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                width: "200px",
                fontSize: "16px",
                backgroundColor: " #d6eaf8 ",  // color de fondo (azul claro)
                color: "#333"                // color del texto
              }}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Contraseña:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{
                marginBottom: "5px",  // separación abajo
                padding: "5px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                width: "200px",
                fontSize: "16px",
                backgroundColor: " #d6eaf8 ",  // color de fondo (azul claro)
                color: "#333"                // color del texto
              }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{
    marginTop: 5,
    padding: "10px 10px",       // tamaño más grande (altura y ancho)
    fontSize: "18px",           // texto más grande
    backgroundColor: "#28a745", // verde bootstrap (verde agradable)
    color: "white",             // texto blanco para contraste
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginLeft: 20,
  }}>
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
