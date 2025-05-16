import React from "react";

export default function ProductoList({ productos, onEdit, onDelete, isAdmin }) {
  if (!productos.length) return <p>No hay productos registrados.</p>;

  return (
    <table border="0" cellPadding="8" cellSpacing="0" style={{ width: "100%", marginTop: 20,
        borderCollapse: "collapse",fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0 8px 8px rgba(0,0,0,0.1)",borderBottom: "5px dotted #333", paddingBottom: "20px",textAlign: "center" 
       }}>
      <thead>
        <tr style={{ backgroundColor: "#2980b9", color: "white" }}>
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
          <tr key={p.codigo} style={{ borderBottom: "1px solid #ccc" }}>
            <td>{p.codigo}</td>
            <td>{p.nombre}</td>
            <td>{p.caracteristicas || "-"}</td>
            <td>{p.precio_usd?.toFixed(2) || "-"}</td>
            <td>{p.moneda || "-"}</td>
            <td>{p.empresa_nit}</td>
            {isAdmin && (
              <td>
                <button onClick={() => onEdit(p)} style={{
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
                <button onClick={() => onDelete(p.codigo)} style={{     marginTop: 5,
    padding: "2px 5px",       // tamaño más grande (altura y ancho)
    fontSize: "14px",           // texto más grande
    backgroundColor: " #c39bd3", // verde bootstrap (verde agradable)
    color: "white",             // texto blanco para contraste
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginLeft: 20,}
    }>Eliminar</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
