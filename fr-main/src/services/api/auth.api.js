import api from "./axios.config.js";

export const authAPI = {
  signup: (data) => api.post("/api/v1/auth/signup", data),
  login: (data) => api.post("/api/v1/auth/login", data),
  logout: () => api.post("/api/v1/auth/logout"),
  getMe: () => api.get("/api/v1/auth/me"),
  forgotPassword: (email) => api.post("/api/v1/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/api/v1/auth/reset-password", data),
};
