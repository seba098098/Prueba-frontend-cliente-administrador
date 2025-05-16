import React from "react";

export default function InventarioList({ inventario, onEdit, onDelete, isAdmin }) {
  if (!inventario.length) return <p>No hay productos en inventario.</p>;

  return (
    <div>
      <table border="0" cellPadding="8" cellSpacing="0" style={{ width: "100%", marginTop: 20,
        borderCollapse: "collapse",fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0 8px 8px rgba(0,0,0,0.1)",borderBottom: "5px dotted #333", paddingBottom: "20px",textAlign: "center" 
       }}>
        <thead>
          <tr style={{ backgroundColor: "#2980b9", color: "white" }}>
          <th>id</th>
            <th>Producto_id</th>
            <th>Empresa</th>
            <th>Cantidad</th>
            {isAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {inventario.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td>{item.id}</td>
              <td>{item.producto_codigo}</td>
              <td>{item.empresa_nit}</td>
              <td>{item.cantidad}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => onEdit(item)} style={{
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
  }}
  >Editar</button>
                  <button onClick={() => onDelete(item.id)} style={{     marginTop: 5,
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

      <div style={{ marginTop: 20 }}>
      </div>
    </div>
  );
}
