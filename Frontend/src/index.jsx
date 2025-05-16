// frontend/src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Importamos el archivo de estilo global (asegúrate de que tailwind esté funcionando)
import './index.css';  // Asegúrate de tener el archivo index.css donde Tailwind se está importando

// Creamos el contenedor root
const root = ReactDOM.createRoot(document.getElementById("root"));

// Renderizamos la aplicación
root.render(<App />);
