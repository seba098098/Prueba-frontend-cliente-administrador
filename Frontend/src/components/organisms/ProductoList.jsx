import React from "react";

export default function ProductoList({ productos, onEdit, onDelete, isAdmin }) {
  if (!productos.length) return <p>No hay productos registrados.</p>;

  return (
    <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", marginTop: 20 }}>
      <thead>
        <tr>
          <th>Código</th>
          <th>Nombre</th>
          <th>Características</th>
          <th>Precio</th>
          <th>Moneda</th>
          <th>Empresa</th>
          {isAdmin && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {productos.map((p) => (
          <tr key={p.codigo}>
            <td>{p.codigo}</td>
            <td>{p.nombre}</td>
            <td>{p.caracteristicas || "-"}</td>
            <td>{p.precio_usd?.toFixed(2) || "-"}</td>
            <td>{p.moneda || "-"}</td>
            <td>{p.empresa_nit}</td>
            {isAdmin && (
              <td>
                <button onClick={() => onEdit(p)}>Editar</button>{" "}
                <button onClick={() => onDelete(p.codigo)}>Eliminar</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
