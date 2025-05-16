import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProductoList from "../organisms/ProductoList";
import ProductoForm from "../organisms/ProductoForm";

export default function Productos() {
  const { token, role } = useAuth();
  const [productos, setProductos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAdmin = role === "admin";

  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/productos");
      if (!res.ok) throw new Error("Error cargando productos");
      const data = await res.json();
      setProductos(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpresas = async () => {
    try {
      const res = await fetch("http://localhost:8000/empresas");
      if (!res.ok) throw new Error("Error cargando empresas");
      const data = await res.json();
      setEmpresas(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchEmpresas();
  }, []);

  const handleSave = async (producto) => {
    setError(null);
    try {
      const isEditing = editing && editing.codigo;
      const url = isEditing
        ? `http://localhost:8000/productos/${producto.codigo}`
        : "http://localhost:8000/productos";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(producto),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Error guardando producto");
      }

      setEditing(null);
      fetchProductos();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (codigo) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/productos/${codigo}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error eliminando producto");
      fetchProductos();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h2>Productos</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Cambiado: setEditing({}) para abrir formulario nuevo */}
      {isAdmin && !editing && (
        <button onClick={() => setEditing({})}>Nuevo Producto</button>
      )}

      {editing && (
        <ProductoForm
          producto={editing?.codigo ? editing : null}
          empresas={empresas}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <ProductoList
          productos={productos}
          onEdit={setEditing}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
