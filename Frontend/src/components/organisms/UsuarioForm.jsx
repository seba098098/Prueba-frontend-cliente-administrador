// src/components/organisms/UsuarioForm.jsx
import React, { useState, useEffect } from "react";

export default function UsuarioForm({ usuario, onSave, onCancel }) {
  const [email, setEmail] = useState(usuario?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(usuario?.role || "externo");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (usuario) {
      setEmail(usuario.email);
      setRole(usuario.role);
    }
  }, [usuario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || (!usuario && !password)) {
      setError("Email y contraseña son obligatorios");
      return;
    }
    onSave({ id: usuario?.id, email, password, role });
  };

  return (
    <form onSubmit={handleSubmit} style={{  padding: 10, marginBottom: 20 }}>
      <h3>{usuario ? "Editar Usuario" : "Nuevo Usuario"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Email:</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={!!usuario} // No permitir cambiar email en edición
          style={{
            marginBottom: "10px",  // separación abajo
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
      <div>
        <label>Contraseña:</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!usuario} // Requerida solo para crear nuevo usuario
          placeholder={usuario ? "Dejar vacío para no cambiar" : ""}
          style={{
            marginBottom: "10px",  // separación abajo
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
      <div>
        <label>Rol:</label><br />
        <select value={role} onChange={(e) => setRole(e.target.value)}  style={{
      marginBottom: "10px",
      padding: "5px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      width: "200px",
      fontSize: "16px",
      backgroundColor: "#d6eaf8",
      color: "#333",
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
      outline: "none",
      cursor: "pointer"
    }}>
          <option value="admin">Admin </option>
          <option value="externo">Externo</option>
        </select>
      </div>
      <button type="submit" style={{
    marginTop: 5,
    padding: "7px 5px",       // tamaño más grande (altura y ancho)
    fontSize: "16px",           // texto más grande
    backgroundColor: "#28a745", // verde bootstrap (verde agradable)
    color: "white",             // texto blanco para contraste
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginLeft: 20,
  }}>Guardar</button>{" "}
      <button type="button" onClick={onCancel} style={{     marginTop: 5,
    padding: "7px 5px",       // tamaño más grande (altura y ancho)
    fontSize: "16px",           // texto más grande
    backgroundColor: "#a569bd", // verde bootstrap (verde agradable)
    color: "white",             // texto blanco para contraste
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginLeft: 20,}}>Cancelar</button>
    </form>
  );
}
