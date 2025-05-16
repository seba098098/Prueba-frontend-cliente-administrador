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
    <form onSubmit={handleSubmit} style={{ padding: 20, marginBottom: 20 }}>
      <h3>{empresa ? "Editar Empresa" : "Nueva Empresa"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label > NIT:</label><br />
        <input
          type="text"
          value={nit} 
          onChange={(e) => setNit(e.target.value)}
          disabled={!!empresa} // no se puede cambiar nit en edición
          required
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
        <label>Nombre:</label><br />
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
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
      <div>
        <label>Dirección:</label><br />
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
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
      <div>
        <label>Teléfono:</label><br />
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
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
  }}>
        Guardar
      </button>{" "}
      <button type="button" onClick={onCancel} style={{     marginTop: 5,
    padding: "7px 5px",       // tamaño más grande (altura y ancho)
    fontSize: "16px",           // texto más grande
    backgroundColor: "#a569bd", // verde bootstrap (verde agradable)
    color: "white",             // texto blanco para contraste
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginLeft: 20,}}>
        Cancelar
      </button>
    </form>
  );
}
