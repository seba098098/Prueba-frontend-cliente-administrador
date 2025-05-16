import React, { useState, useEffect } from "react";

export default function ProductoForm({ producto, empresas, onSave, onCancel }) {
  const [codigo, setCodigo] = useState(producto?.codigo || "");
  const [nombre, setNombre] = useState(producto?.nombre || "");
  const [caracteristicas, setCaracteristicas] = useState(producto?.caracteristicas || "");
  const [precioUsd, setPrecioUsd] = useState(producto?.precio_usd || "");
  const [moneda, setMoneda] = useState(producto?.moneda || "USD");
  const [empresaNit, setEmpresaNit] = useState(producto?.empresa_nit || "");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (producto) {
      setCodigo(producto.codigo);
      setNombre(producto.nombre);
      setCaracteristicas(producto.caracteristicas || "");
      setPrecioUsd(producto.precio_usd || "");
      setMoneda(producto.moneda || "USD");
      setEmpresaNit(producto.empresa_nit || "");
    } else {
      // Cuando es nuevo producto, limpiar campos
      setCodigo("");
      setNombre("");
      setCaracteristicas("");
      setPrecioUsd("");
      setMoneda("USD");
      setEmpresaNit("");
    }
  }, [producto]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!codigo || !nombre || !empresaNit) {
      setError("Código, Nombre y Empresa son obligatorios");
      return;
    }
    if (precioUsd !== "" && isNaN(parseFloat(precioUsd))) {
      setError("Precio debe ser un número válido");
      return;
    }
    onSave({
      codigo,
      nombre,
      caracteristicas,
      precio_usd: parseFloat(precioUsd) || 0,
      moneda,
      empresa_nit: empresaNit,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 10, marginBottom: 20 }}>
      <h3>{producto ? "Editar Producto" : "Nuevo Producto"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Código:</label><br />
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          disabled={!!producto} // Deshabilitar solo en edición
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
        <label>Características:</label><br />
        <textarea
          value={caracteristicas}
          onChange={(e) => setCaracteristicas(e.target.value)}
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
        <label>Precio:</label><br />
        <input
          type="number"
          step="0.01"
          value={precioUsd}
          onChange={(e) => setPrecioUsd(e.target.value)}
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
        <label>Moneda:</label><br />
        <select value={moneda} onChange={(e) => setMoneda(e.target.value)}
                      style={{
                        marginBottom: "5px",  // separación abajo
                        padding: "5px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        width: "200px",
                        fontSize: "16px",
                        backgroundColor: " #d6eaf8 ",  // color de fondo (azul claro)
                        color: "#333"                // color del texto
                      }}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="COP">COP</option>
        </select>
      </div>
      <div>
        <label>Empresa:</label><br />
        <select
          value={empresaNit}
          onChange={(e) => setEmpresaNit(e.target.value)}
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
        >
          <option value="">-- Selecciona empresa --</option>
          {empresas.map((e) => (
            <option key={e.nit} value={e.nit}>
              {e.nombre} ({e.nit})
            </option>
          ))}
        </select>
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
