import axios from "axios";

const api = axios.create({
  // baseURL: "http://127.0.0.1:8000/api",
  baseURL: process.env.VITE_API_URL,
});

// Añadir el token JWT automáticamente si existe
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
