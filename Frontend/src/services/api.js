import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
  });

export const getEmpresas = () => api.get("/empresas");
export const crearEmpresa = (data) => api.post("/empresas", data);

export default api;
