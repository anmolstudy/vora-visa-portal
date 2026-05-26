import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import API from "../services/api";
 
// ── Status chip config ────────────────────────────────────────────────────
const STATUS_CONFIG = {
  success: { label: "Success", color: "success", icon: <CheckCircleOutlineIcon sx={{ fontSize: 13 }} /> },
  failed: { label: "Failed", color: "error", icon: <CancelOutlinedIcon sx={{ fontSize: 13 }} /> },
  pending: { label: "Pending", color: "warning", icon: <PendingOutlinedIcon sx={{ fontSize: 13 }} /> },
  refunded: { label: "Refunded", color: "default", icon: <RefreshIcon sx={{ fontSize: 13 }} /> },
};
 
const SERVICE_LABELS = {
  tourist: "Tourist Visa",
  student: "Student Visa",
  work: "Work Visa Premium",
};
 
// ── Summary stat card ─────────────────────────────────────────────────────
function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 3 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ bgcolor: `${color}18`, width: 48, height: 48 }}>
          <Box sx={{ color, display: "flex" }}>{icon}</Box>
        </Avatar>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={800} color="text.primary">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
 
export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
 
  // Detail / Edit / Delete dialogs
  const [viewPayment, setViewPayment] = useState(null);
  const [editPayment, setEditPayment] = useState(null);
  const [deletePayment, setDeletePayment] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
 
  // ── Fetch ──────────────────────────────────────────────────────────────
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
      });
      if (statusFilter !== "all") params.append("status", statusFilter);
 
      const res = await API.get(`/payments/admin/all?${params}`);
      setPayments(res.data.payments || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter]);
 
  useEffect(() => { fetchPayments(); }, [fetchPayments]);
 
  // ── Derived stats ──────────────────────────────────────────────────────
  const totalRevenue = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);
 
  const successCount = payments.filter((p) => p.status === "success").length;
  const failedCount = payments.filter((p) => p.status === "failed").length;
 
  // ── Client-side search filter ──────────────────────────────────────────
  const filtered = payments.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.userName?.toLowerCase().includes(q) ||
      p.userEmail?.toLowerCase().includes(q) ||
      p.orderId?.toLowerCase().includes(q) ||
      p.serviceName?.toLowerCase().includes(q)
    );
  });
 
  // ── Update payment ─────────────────────────────────────────────────────
  const handleUpdate = async () => {
    setActionLoading(true);
    try {
      await API.put(`/payments/${editPayment._id}`, {
        status: editStatus,
        notes: editNotes,
      });
      setActionMsg("Payment updated successfully.");
      setEditPayment(null);
      fetchPayments();
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Update failed.");
    } finally {
      setActionLoading(false);
    }
  };
 
  // ── Delete payment ─────────────────────────────────────────────────────
  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await API.delete(`/payments/${deletePayment._id}`);
      setActionMsg("Payment record deleted.");
      setDeletePayment(null);
      fetchPayments();
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Delete failed.");
    } finally {
      setActionLoading(false);
    }
  };
 
  // ── Format helpers ─────────────────────────────────────────────────────
  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
 
  const fmtAmount = (n) =>
    `₹${Number(n).toLocaleString("en-IN")}`;
 
  return (
    <Box>
      {/* ── Page header ── */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Payments</Typography>
          <Typography variant="body2" color="text.secondary">All user payment transactions from the main website</Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchPayments} sx={{ bgcolor: "#F3F4F6", "&:hover": { bgcolor: "#E5E7EB" } }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
 
      {/* ── Summary cards ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Payments" value={total} icon={<PaymentsIcon />} color="#3B82F6" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Revenue (this page)" value={fmtAmount(totalRevenue)} icon={<CurrencyRupeeIcon />} color="#10B981" subtitle="Successful transactions" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Successful" value={successCount} icon={<CheckCircleOutlineIcon />} color="#10B981" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Failed" value={failedCount} icon={<CancelOutlinedIcon />} color="#EF4444" />
        </Grid>
      </Grid>
 
      {/* ── Filters ── */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, border: "1px solid #E5E7EB", borderRadius: 3, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Search by name, email, order ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="refunded">Refunded</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
          Showing {filtered.length} of {total} records
        </Typography>
      </Paper>
 
      {/* ── Action feedback ── */}
      {actionMsg && (
        <Alert severity="success" onClose={() => setActionMsg("")} sx={{ mb: 2 }}>
          {actionMsg}
        </Alert>
      )}
 
      {/* ── Table ── */}
      <Paper elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 3, overflow: "hidden" }}>
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
 
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Card</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6, color: "text.secondary" }}>
                        No payment records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((p) => {
                      const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
                      return (
                        <TableRow key={p._id} hover>
                          <TableCell>
                            <Typography variant="caption" fontWeight={700} sx={{ fontFamily: "monospace", color: "#6366F1" }}>
                              #{p.orderId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{p.userName}</Typography>
                              <Typography variant="caption" color="text.secondary">{p.userEmail}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={SERVICE_LABELS[p.serviceId] || p.serviceName}
                              size="small"
                              sx={{ bgcolor: "#EEF2FF", color: "#4338CA", fontWeight: 600, fontSize: "0.7rem" }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={700} color="#10B981">
                              {fmtAmount(p.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={sc.icon}
                              label={sc.label}
                              color={sc.color}
                              size="small"
                              variant="outlined"
                              sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {p.cardLast4 ? `•••• ${p.cardLast4}` : "—"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {fmtDate(p.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                              <Tooltip title="View Details">
                                <IconButton size="small" onClick={() => setViewPayment(p)} sx={{ color: "#6366F1" }}>
                                  <VisibilityOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Status">
                                <IconButton size="small" onClick={() => { setEditPayment(p); setEditStatus(p.status); setEditNotes(p.notes || ""); }} sx={{ color: "#F59E0B" }}>
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Record">
                                <IconButton size="small" onClick={() => setDeletePayment(p)} sx={{ color: "#EF4444" }}>
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
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
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </>
        )}
      </Paper>
 
      {/* ── View Detail Dialog ── */}
      <Dialog open={!!viewPayment} onClose={() => setViewPayment(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: "1px solid #E5E7EB" }}>
          Payment Details — <span style={{ color: "#6366F1", fontFamily: "monospace" }}>#{viewPayment?.orderId}</span>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {viewPayment && (
            <Grid container spacing={2}>
              {[
                ["User Name", viewPayment.userName],
                ["Email", viewPayment.userEmail],
                ["Service", SERVICE_LABELS[viewPayment.serviceId] || viewPayment.serviceName],
                ["Amount", fmtAmount(viewPayment.amount)],
                ["Currency", viewPayment.currency],
                ["Status", viewPayment.status?.toUpperCase()],
                ["Card (last 4)", viewPayment.cardLast4 ? `•••• ${viewPayment.cardLast4}` : "—"],
                ["Cardholder", viewPayment.cardHolderName || "—"],
                ["Date", fmtDate(viewPayment.createdAt)],
                ["Notes", viewPayment.notes || "—"],
              ].map(([label, value]) => (
                <Grid item xs={6} key={label}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</Typography>
                  <Typography variant="body2" fontWeight={600}>{value}</Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewPayment(null)}>Close</Button>
        </DialogActions>
      </Dialog>
 
      {/* ── Edit Dialog ── */}
      <Dialog open={!!editPayment} onClose={() => setEditPayment(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Payment Status</DialogTitle>
        <DialogContent sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select value={editStatus} label="Status" onChange={(e) => setEditStatus(e.target.value)}>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="success">Success</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            size="small"
            label="Notes (optional)"
            multiline
            rows={3}
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPayment(null)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleUpdate} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={18} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
 
      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={!!deletePayment} onClose={() => setDeletePayment(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Payment Record?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently delete order <strong>#{deletePayment?.orderId}</strong> from the database. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletePayment(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={18} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}