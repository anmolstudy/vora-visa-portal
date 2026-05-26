import api from "./axios.config.js";

export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get("/api/v1/admin/dashboard/stats"),

  // Users
  getAllUsers: (params) => api.get("/api/v1/admin/users", { params }),
  getUserById: (id) => api.get(`/api/v1/admin/users/${id}`),
  updateUserStatus: (id, status) => api.patch(`/api/v1/admin/users/${id}/status`, { status }),
  updateUserRole: (id, role) => api.patch(`/api/v1/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/api/v1/admin/users/${id}`),

  // Logs
  getAuthLogs: (params) => api.get("/api/v1/admin/logs/auth", { params }),
  getActivityLogs: (params) => api.get("/api/v1/admin/logs/activity", { params }),
};
