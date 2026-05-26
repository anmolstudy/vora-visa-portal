import { useState, useEffect, useCallback } from "react";
import { adminAPI } from "../services/api/admin.api.js";

export const useAdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDashboardStats();
      setStats(res.data.stats);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

export const useAdminUsers = (params = {}) => {
  const [data, setData] = useState({ users: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllUsers(params);
      setData({
        users: res.data.users,
        total: res.data.total,
        totalPages: res.data.totalPages,
        currentPage: res.data.currentPage,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return { ...data, loading, error, refetch: fetchUsers };
};

export const useAuthLogs = (params = {}) => {
  const [data, setData] = useState({ logs: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAuthLogs(params);
      setData({
        logs: res.data.logs,
        total: res.data.total,
        totalPages: res.data.totalPages,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return { ...data, loading, error, refetch: fetchLogs };
};
