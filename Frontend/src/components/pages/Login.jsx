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
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
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
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ marginTop: 20 }}>
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
