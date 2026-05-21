import axios from "axios";

// Use relative path so Vite dev proxy handles it in development.
// In production, use VITE_API_BASE_URL when provided, otherwise use same-origin paths.
const baseURL = import.meta.env.DEV
  ? "/"
  : (import.meta.env.VITE_API_BASE_URL || "/");

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