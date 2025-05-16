// src/components/organisms/EmpresaList.jsx
import React from "react";

export default function EmpresaList({ empresas, onEdit, onDelete, isAdmin }) {
  if (!empresas.length) return <p>No hay empresas registradas.</p>;

  return (
    <table border="0" cellPadding="8" cellSpacing="0"   style={{
        width: "100%",
        marginTop: 20,
        borderCollapse: "collapse",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0 8px 8px rgba(0,0,0,0.1)",
        borderBottom: "5px dotted #333", paddingBottom: "20px",
        textAlign: "center" 
      }}>
      <thead>
        <tr style={{ backgroundColor: "#2980b9", color: "white" }}>
          <th>NIT</th>
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Teléfono</th>
          {isAdmin && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {empresas.map((empresa) => (
          <tr key={empresa.nit} style={{ borderBottom: "1px solid #ccc" }}>
            <td>{empresa.nit}</td>
            <td>{empresa.nombre}</td>
            <td>{empresa.direccion || "-"}</td>
            <td>{empresa.telefono || "-"}</td>
            {isAdmin && (
              <td>
                <button onClick={() => onEdit(empresa)} style={{
    marginTop: 5,
    padding: "2px 5px",       // tamaño más grande (altura y ancho)
    fontSize: "14px",           // texto más grande
    backgroundColor: "#28a745", // verde bootstrap (verde agradable)
    color: "white",             // texto blanco para contraste
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginLeft: 20,
  }}>Editar</button>{" "}
                <button onClick={() => onDelete(empresa.nit)} style={{     marginTop: 5,
    padding: "2px 5px",       // tamaño más grande (altura y ancho)
    fontSize: "14px",           // texto más grande
    backgroundColor: " #c39bd3", // verde bootstrap (verde agradable)
    color: "white",             // texto blanco para contraste
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginLeft: 20,}}
    >Eliminar</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
