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
    <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
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
        />
      </div>
      <div>
        <label>Rol:</label><br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="externo">Externo</option>
        </select>
      </div>
      <button type="submit" style={{ marginTop: 10 }}>Guardar</button>{" "}
      <button type="button" onClick={onCancel} style={{ marginTop: 10 }}>Cancelar</button>
    </form>
  );
}
