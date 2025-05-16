import React from "react";

export default function InventarioList({ inventario, onEdit, onDelete, isAdmin }) {
  if (!inventario.length) return <p>No hay productos en inventario.</p>;

  return (
    <div>
      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
          <th>id</th>
            <th>Producto_id</th>
            <th>Empresa</th>
            <th>Cantidad</th>
            {isAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {inventario.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.producto_codigo}</td>
              <td>{item.empresa_nit}</td>
              <td>{item.cantidad}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => onEdit(item)}>Editar</button>
                  <button onClick={() => onDelete(item.id)}>Eliminar</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20 }}>
      </div>
    </div>
  );
}
