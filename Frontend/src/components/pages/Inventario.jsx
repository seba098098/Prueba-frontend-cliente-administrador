import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import InventarioList from "../organisms/InventarioList";
import InventarioForm from "../organisms/InventarioForm";
import { jsPDF } from "jspdf";

export default function Inventario() {
  const { token, role } = useAuth();
  const [inventario, setInventario] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailDestinatario, setEmailDestinatario] = useState("");

  const isAdmin = role === "admin";

  // Cargar inventario
  const fetchInventario = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/inventario");
      if (!res.ok) throw new Error("Error cargando inventario");
      const data = await res.json();
      setInventario(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar empresas para select del formulario
  const fetchEmpresas = async () => {
    try {
      const res = await fetch("http://localhost:8000/empresas");
      if (!res.ok) throw new Error("Error cargando empresas");
      const data = await res.json();
      setEmpresas(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchInventario();
    fetchEmpresas();
  }, []);

  // Guardar nuevo o actualizar inventario
  const handleSave = async (data) => {
    setError(null);
    const url = editing && editing.id
      ? `http://localhost:8000/inventario/${editing.id}`
      : "http://localhost:8000/inventario";
    const method = editing && editing.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error guardando inventario");
      }
      fetchInventario();
      setEditing(null);
    } catch (e) {
      setError(e.message);
    }
  };

  // Eliminar inventario
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este ítem de inventario?")) return;
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/inventario/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error eliminando inventario");
      fetchInventario();
    } catch (e) {
      setError(e.message);
    }
  };

  // Generar PDF para descarga
  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Inventario de Productos", 14, 16);
    pdf.setFontSize(12);

    const tableColumn = ["id", "Producto_id", "Empresa", "Cantidad"];
    const tableRows = inventario.map((item) => [
      item.id || "N/A",
      item.producto_codigo || "N/A",
      item.empresa_nit || "N/A",
      item.cantidad || "N/A",
    ]);

    const startY = 30;
    let currentY = startY;

    const headerX = [14, 40, 80, 120, 160];
    tableColumn.forEach((col, i) => pdf.text(col, headerX[i], currentY));
    currentY += 10;

    tableRows.forEach(row => {
      row.forEach((cell, i) => pdf.text(cell.toString(), headerX[i], currentY));
      currentY += 10;
    });

    pdf.save("inventario.pdf");
    return pdf;
  };

  // Enviar PDF por correo
  const handleSendEmail = async () => {
    if (!emailDestinatario) {
      alert("Por favor, ingresa un correo destinatario.");
      return;
    }

    const pdf = handleDownloadPDF();

    const emailData = new FormData();
    emailData.append("file", pdf.output("blob"), "inventario.pdf");
    emailData.append("email_destino", emailDestinatario);

    try {
      const res = await fetch("http://localhost:8000/enviar-pdf", {
        method: "POST",
        body: emailData,
      });

      const data = await res.json();
      if (data.message.includes("exitosamente")) {
        alert("PDF enviado por correo exitosamente.");
      } else {
        alert("Hubo un error al enviar el correo.");
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h2>Inventario</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Botones y campo correo visibles para todos */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={handleDownloadPDF}>Descargar PDF</button>
        <input
          type="email"
          placeholder="Correo destinatario"
          value={emailDestinatario}
          onChange={(e) => setEmailDestinatario(e.target.value)}
          style={{ marginLeft: 10, padding: "5px", width: 250 }}
        />
        <button onClick={handleSendEmail} style={{ marginLeft: 10 }}>
          Enviar PDF por correo
        </button>
      </div>

      {/* Funcionalidad CRUD solo para admin */}
      {isAdmin && !editing && (
        <button onClick={() => setEditing({})} style={{ marginBottom: 20 }}>
          Nuevo Inventario
        </button>
      )}

      {editing && (
        <InventarioForm
          inventario={editing}
          empresas={empresas}
          isEditing={Boolean(editing && editing.id)}  // true solo si editing tiene id (es edición)
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <p>Cargando inventario...</p>
      ) : (
        <InventarioList
          inventario={inventario}
          onEdit={isAdmin ? setEditing : undefined}
          onDelete={isAdmin ? handleDelete : undefined}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
