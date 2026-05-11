import axios from "axios";

// Use relative path so Vite dev proxy handles it
// In dev, requests to /auth, /alunos, etc. will be proxied to http://localhost:8080
// In production (built), it will use the baseURL
const baseURL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "/" : "http://localhost:8080");


export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function unwrapResponse(response) {
  return response?.data;
}

export default api;