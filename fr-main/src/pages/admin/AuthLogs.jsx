import { useState } from "react";
import {
  Box, Card, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination,
  Chip, CircularProgress, Alert, FormControl, InputLabel,
  Select, MenuItem, IconButton, Tooltip,
} from "@mui/material";
import { Refresh, CheckCircle, ErrorOutline, Login, PersonAdd, Logout, LockReset } from "@mui/icons-material";
import { useAuthLogs } from "../../hooks/useAdmin.js";

const ACTION_ICONS = {
  login: <Login fontSize="small" />,
  signup: <PersonAdd fontSize="small" />,
  logout: <Logout fontSize="small" />,
  login_failed: <ErrorOutline fontSize="small" />,
  password_reset: <LockReset fontSize="small" />,
};

const ACTION_COLORS = {
  login: "primary",
  signup: "success",
  logout: "default",
  login_failed: "error",
  password_reset: "warning",
};

export default function AuthLogs() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [actionFilter, setActionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { logs, total, loading, error, refetch } = useAuthLogs({
    page: page + 1,
    limit: rowsPerPage,
    action: actionFilter,
    status: statusFilter,
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0D47A1" }}>
            Authentication Logs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All login, signup, and authentication activity
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={refetch} color="primary"><Refresh /></IconButton>
        </Tooltip>
      </Box>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Action</InputLabel>
          <Select value={actionFilter} label="Action" onChange={(e) => { setActionFilter(e.target.value); setPage(0); }}>
            <MenuItem value="">All Actions</MenuItem>
            <MenuItem value="login">Login</MenuItem>
            <MenuItem value="login_failed">Login Failed</MenuItem>
            <MenuItem value="signup">Signup</MenuItem>
            <MenuItem value="logout">Logout</MenuItem>
            <MenuItem value="password_reset">Password Reset</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </FormControl>
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
                    <TableCell>Action</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log._id} hover>
                      <TableCell>
                        <Chip
                          icon={ACTION_ICONS[log.action]}
                          label={log.action?.replace("_", " ")}
                          size="small"
                          color={ACTION_COLORS[log.action] || "default"}
                          sx={{ textTransform: "capitalize", fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {log.userId?.name || <span style={{ color: "#aaa" }}>Unknown</span>}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{log.email}</Typography>
                      </TableCell>
                      <TableCell>
                        {log.status === "success"
                          ? <CheckCircle sx={{ fontSize: 18, color: "success.main" }} />
                          : <ErrorOutline sx={{ fontSize: 18, color: "error.main" }} />}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: 12 }}>
                          {log.ipAddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {log.failureReason || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(log.createdAt).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {logs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">No logs found</Typography>
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
              rowsPerPageOptions={[10, 20, 50]}
            />
          </>
        )}
      </Card>
    </Box>
  );
}
