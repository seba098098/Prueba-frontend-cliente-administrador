// src/components/organisms/EmpresaList.jsx
import React from "react";

export default function EmpresaList({ empresas, onEdit, onDelete, isAdmin }) {
  if (!empresas.length) return <p>No hay empresas registradas.</p>;

  return (
    <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", marginTop: 20 }}>
      <thead>
        <tr>
          <th>NIT</th>
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Teléfono</th>
          {isAdmin && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {empresas.map((empresa) => (
          <tr key={empresa.nit}>
            <td>{empresa.nit}</td>
            <td>{empresa.nombre}</td>
            <td>{empresa.direccion || "-"}</td>
            <td>{empresa.telefono || "-"}</td>
            {isAdmin && (
              <td>
                <button onClick={() => onEdit(empresa)}>Editar</button>{" "}
                <button onClick={() => onDelete(empresa.nit)}>Eliminar</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
