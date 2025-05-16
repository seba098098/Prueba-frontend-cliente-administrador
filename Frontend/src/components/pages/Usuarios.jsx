// src/components/pages/Usuarios.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import UsuarioList from "../organisms/UsuarioList";
import UsuarioForm from "../organisms/UsuarioForm";

export default function Usuarios() {
  const { token, role } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAdmin = role === "admin";

  // Memoizar fetchUsuarios para evitar warning en useEffect
  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error cargando usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAdmin) fetchUsuarios();
  }, [isAdmin, fetchUsuarios]);

  const handleSave = async (usuario) => {
    setError(null);
    try {
      const isEditing = editing && editing.id;
      const url = isEditing
        ? `http://localhost:8000/usuarios/${usuario.id}`
        : "http://localhost:8000/usuarios";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuario),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Error guardando usuario");
      }

      setEditing(null);
      fetchUsuarios();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error eliminando usuario");
      fetchUsuarios();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!isAdmin) {
    return <p>No tienes permisos para ver esta página.</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Usuarios</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!editing && (
        <button onClick={() => setEditing({})} style={{
            marginBottom: "5px",  // separación abajo
            padding: "5px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            width: "200px",
            fontSize: "16px",
            backgroundColor: " #d6eaf8 ",  // color de fondo (azul claro)
            color: "#333",                // color del texto
            textAlign: "center"
          }}>Nuevo Usuario</button>
      )}
      {editing && (
        <UsuarioForm
          usuario={editing?.id ? editing : null}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <UsuarioList
          usuarios={usuarios}
          onEdit={setEditing}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
