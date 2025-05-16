// src/components/organisms/UsuarioList.jsx
import React from "react";

export default function UsuarioList({ usuarios, onEdit, onDelete, isAdmin }) {
  if (!usuarios.length) return <p>No hay usuarios registrados.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Password</th>
          {isAdmin && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {usuarios.map((u) => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>********</td>
            {isAdmin && (
              <td>
                <button onClick={() => onEdit(u)}>Editar</button>{" "}
                <button onClick={() => onDelete(u.id)}>Eliminar</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
