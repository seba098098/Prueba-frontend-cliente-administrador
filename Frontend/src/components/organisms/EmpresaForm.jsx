// src/components/organisms/EmpresaForm.jsx
import React, { useState, useEffect } from "react";

export default function EmpresaForm({ empresa, onSave, onCancel }) {
  const [nit, setNit] = useState(empresa?.nit || "");
  const [nombre, setNombre] = useState(empresa?.nombre || "");
  const [direccion, setDireccion] = useState(empresa?.direccion || "");
  const [telefono, setTelefono] = useState(empresa?.telefono || "");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (empresa) {
      setNit(empresa.nit);
      setNombre(empresa.nombre);
      setDireccion(empresa.direccion || "");
      setTelefono(empresa.telefono || "");
    }
  }, [empresa]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nit || !nombre) {
      setError("NIT y Nombre son obligatorios");
      return;
    }
    onSave({ nit, nombre, direccion, telefono });
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
      <h3>{empresa ? "Editar Empresa" : "Nueva Empresa"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>NIT:</label><br />
        <input
          type="text"
          value={nit}
          onChange={(e) => setNit(e.target.value)}
          disabled={!!empresa} // no se puede cambiar nit en edición
          required
        />
      </div>
      <div>
        <label>Nombre:</label><br />
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Dirección:</label><br />
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
      </div>
      <div>
        <label>Teléfono:</label><br />
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>
      <button type="submit" style={{ marginTop: 10 }}>
        Guardar
      </button>{" "}
      <button type="button" onClick={onCancel} style={{ marginTop: 10 }}>
        Cancelar
      </button>
    </form>
  );
}
