// src/components/pages/Empresas.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import EmpresaList from "../organisms/EmpresaList";
import EmpresaForm from "../organisms/EmpresaForm";

export default function Empresas() {
  const { token, role } = useAuth();
  const [empresas, setEmpresas] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAdmin = role === "admin";

  const fetchEmpresas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/empresas");
      if (!res.ok) throw new Error("Error cargando empresas");
      const data = await res.json();
      setEmpresas(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleSave = async (empresa) => {
    setError(null);
    try {
      const isEditing = editing && editing.nit;
      const url = isEditing
        ? `http://localhost:8000/empresas/${empresa.nit}`
        : "http://localhost:8000/empresas";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(empresa),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Error guardando empresa");
      }

      setEditing(null);
      fetchEmpresas();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (nit) => {
    if (!window.confirm("¿Eliminar esta empresa?")) return;
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/empresas/${nit}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error eliminando empresa");
      fetchEmpresas();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2>Empresas</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isAdmin && !editing && (
        <button onClick={() => setEditing({})}>Nueva Empresa</button>
      )}

      {editing && (
        <EmpresaForm
          empresa={editing?.nit ? editing : null}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <p>Cargando empresas...</p>
      ) : (
        <EmpresaList
          empresas={empresas}
          onEdit={setEditing}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
