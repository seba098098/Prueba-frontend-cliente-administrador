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
        />
      </div>
      <div>
        <label>Empresa:</label>
        <select
          value={empresaNit}
          onChange={(e) => setEmpresaNit(e.target.value)}

          required
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
        />
      </div>

      <button type="submit">{inventario ? "Actualizar" : "Crear"}</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
}
