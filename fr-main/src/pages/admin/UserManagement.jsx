import { useState, useCallback } from "react";
import {
  Box, Card, Typography, TextField, MenuItem, Select,
  FormControl, InputLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination,
  Chip, Avatar, IconButton, Tooltip, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, CircularProgress,
  Alert, InputAdornment,
} from "@mui/material";
import {
  Search, Delete, Edit, CheckCircle, Block, Warning,
  PersonOff, Refresh,
} from "@mui/icons-material";
import { useAdminUsers } from "../../hooks/useAdmin.js";
import { adminAPI } from "../../services/api/admin.api.js";

const STATUS_COLORS = {
  active: "success",
  inactive: "warning",
  suspended: "error",
};

const ROLE_COLORS = {
  admin: "#7B1FA2",
  employee: "#1565C0",
  user: "#2E7D32",
};

export default function UserManagement() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loadingAction, setLoadingAction] = useState("");

  const { users, total, totalPages, loading, error, refetch } = useAdminUsers({
    page: page + 1,
    limit: rowsPerPage,
    search,
    role: roleFilter,
    status: statusFilter,
  });

  const handleStatusToggle = useCallback(async (user) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    setLoadingAction(user.id);
    setActionError("");
    try {
      await adminAPI.updateUserStatus(user.id, newStatus);
      setActionSuccess(`User ${user.name} ${newStatus === "active" ? "activated" : "suspended"}`);
      refetch();
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (err) {
      setActionError(err.response?.data?.message || "Action failed");
    } finally {
      setLoadingAction("");
    }
  }, [refetch]);

  const handleDelete = useCallback(async () => {
    if (!confirmDelete) return;
    setLoadingAction(confirmDelete.id);
    setActionError("");
    try {
      await adminAPI.deleteUser(confirmDelete.id);
      setActionSuccess(`User ${confirmDelete.name} deleted`);
      setConfirmDelete(null);
      refetch();
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (err) {
      setActionError(err.response?.data?.message || "Delete failed");
    } finally {
      setLoadingAction("");
    }
  }, [confirmDelete, refetch]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0D47A1" }}>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {total} total users
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {actionError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError("")}>{actionError}</Alert>}
      {actionSuccess && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setActionSuccess("")}>{actionSuccess}</Alert>}

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
        />
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Role</InputLabel>
          <Select value={roleFilter} label="Role" onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}>
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </Select>
        </FormControl>
        {(search || roleFilter || statusFilter) && (
          <Button size="small" onClick={() => { setSearch(""); setRoleFilter(""); setStatusFilter(""); setPage(0); }}>
            Clear Filters
          </Button>
        )}
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ "& th": { fontWeight: 700, bgcolor: "#F5F7FA" } }}>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: ROLE_COLORS[user.role] + "20", color: ROLE_COLORS[user.role], width: 36, height: 36, fontSize: 14 }}>
                            {user.name?.[0]?.toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          sx={{ bgcolor: ROLE_COLORS[user.role] + "15", color: ROLE_COLORS[user.role], fontWeight: 700, textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          color={STATUS_COLORS[user.status] || "default"}
                          sx={{ textTransform: "capitalize", fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                          <Tooltip title={user.status === "active" ? "Suspend User" : "Activate User"}>
                            <IconButton
                              size="small"
                              color={user.status === "active" ? "warning" : "success"}
                              onClick={() => handleStatusToggle(user)}
                              disabled={loadingAction === user.id}
                            >
                              {loadingAction === user.id
                                ? <CircularProgress size={16} />
                                : user.status === "active" ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setConfirmDelete(user)}
                              disabled={loadingAction === user.id}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <PersonOff sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                        <Typography color="text.secondary">No users found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Card>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle sx={{ fontWeight: 700, color: "error.main" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{confirmDelete?.name}</strong> ({confirmDelete?.email})?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={!!loadingAction}>
            {loadingAction ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
