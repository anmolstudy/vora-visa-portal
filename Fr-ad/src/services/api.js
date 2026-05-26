import axios from "axios";

// Both admin and main frontend use the same backend
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`,
});

// Attach JWT token if present (for protected admin routes)
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
