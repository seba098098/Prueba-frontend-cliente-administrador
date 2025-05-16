import React, { useState, useEffect } from "react";

export default function InventarioForm({ inventario, empresas, onSave, onCancel, isEditing }) {
  const [productoCodigo, setProductoCodigo] = useState(inventario?.producto_codigo || "");
  const [empresaNit, setEmpresaNit] = useState(inventario?.empresa_nit || "");
  const [cantidad, setCantidad] = useState(inventario?.cantidad || "");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (inventario) {
      setProductoCodigo(inventario.producto_codigo);
      setEmpresaNit(inventario.empresa_nit);
      setCantidad(inventario.cantidad);
    }
  }, [inventario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productoCodigo || !empresaNit || !cantidad) {
      setError("Todos los campos son obligatorios");
      return;
    }
    onSave({
      producto_codigo: productoCodigo,
      empresa_nit: empresaNit,
      cantidad: parseInt(cantidad),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{inventario ? "Editar Inventario" : "Nuevo Inventario"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Código de Producto:</label>
        <input
          type="text"
          value={productoCodigo}
          onChange={(e) => setProductoCodigo(e.target.value)}
          required
          disabled={isEditing} // No se puede cambiar en caso de edición
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
        <label>Empresa:</label>
        <select
          value={empresaNit}
          onChange={(e) => setEmpresaNit(e.target.value)}

          required
          style={{
            marginBottom: "10px",  // separación abajo
            padding: "5px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            width: "200px",
            fontSize: "14px",
            backgroundColor: " #d6eaf8 ",  // color de fondo (azul claro)
            color: "#333"     }}
        >
          <option value="">-- Selecciona empresa --</option>
          {empresas.map((e) => (
            <option key={e.nit} value={e.nit}>
              {e.nombre} ({e.nit})
            </option>

          ))}
        </select>
      </div>
      <div>
        <label>Cantidad:</label>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
          style={{
            marginBottom: "10px",  // separación abajo
            padding: "5px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            width: "200px",
            fontSize: "14px",
            backgroundColor: " #d6eaf8 ",  // color de fondo (azul claro)
            color: "#333"                // color del texto
          }}
        />
      </div>

      <button type="submit"  style={{
    marginTop: 5,
    padding: "7px 5px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginLeft: 20,
  }}>{inventario ? "Actualizar" : "Crear"}</button>
      <button type="button" onClick={onCancel} style={{
    marginTop: 5,
    padding: "7px 15px",
    fontSize: "16px",
    backgroundColor: "#a569bd", // rojo bootstrap para cancelar
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginLeft: 10,
  }}>Cancelar</button>
    </form>
  );
}
