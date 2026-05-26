import { useState } from "react";
import {
  Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Box, TextField,
  Select, MenuItem, FormControl, InputLabel, TablePagination,
  InputAdornment, Button, IconButton, Dialog, DialogContent,
  DialogActions, Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AddCandidateModal from "./AddCandidateModal";
import EditCandidateModal from "./EditCandidateModal";
import CandidateProfile from "./CandidateProfile";
import { exportCandidates } from "../utils/ExportUtils";

function StatusChip({ status }) {
  const map = {
    "IN MAIL": { bg: "#EEF0FB", color: "#3F51B5", label: "In Mail" },
    "IN OFFICE": { bg: "#DCFCE7", color: "#16A34A", label: "In Office" },
    COURIER: { bg: "#FEF3C7", color: "#B45309", label: "Courier" },
    "COURIER TO MS OFFICE": { bg: "#FEE2E2", color: "#DC2626", label: "Courier MS" },
    "AT DELHI": { bg: "#F3E8FF", color: "#7C3AED", label: "At Delhi" },
  };
  const s = map[status?.toUpperCase()] || { bg: "#f5f5f5", color: "#616161", label: status || "—" };
  return (
    <Chip label={s.label} size="small"
      sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: 11, borderRadius: 1.5 }} />
  );
}

function isExpiringSoon(ppExp) {
  if (!ppExp) return false;
  return new Date(ppExp) - new Date() < 180 * 24 * 60 * 60 * 1000;
}

const COUNTRY_OPTIONS = ["All", "Dubai", "Kuwait", "Romania", "Croatia", "Bulgaria", "Russia", "Other"];
const STATUS_OPTIONS = ["All", "IN MAIL", "IN OFFICE", "COURIER", "AT DELHI", "COURIER TO MS OFFICE"];
const PAYMENT_OPTIONS = ["All", "PAID", "PENDING"];

const PIPELINE_STATUS_COLORS = {
  NEW: { bg: "#E3F2FD", color: "#333" },
  CONTACTED: { bg: "#E8F5E9", color: "#333" },
  PROCESSING: { bg: "#FFF3E0", color: "#333" },
  DOCUMENTS: { bg: "#EDE7F6", color: "#333" },
  "VISA APPLIED": { bg: "#E0F7FA", color: "#333" },
  APPROVED: { bg: "#C8E6C9", color: "#2E7D32" },
  REJECTED: { bg: "#FFCDD2", color: "#C62828" },
};

export default function CandidateTable({
  candidates,
  onAdd,
  onEdit,
  onDelete,
  agents,
  showAddButton = true,
  docChecks,
  onDocToggle,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRpp] = useState(10);

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filter candidates — removed the broken `c.trade === 'user'` check
  const filtered = (candidates || []).filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      c.name?.toLowerCase().includes(q) ||
      c.passport?.toLowerCase().includes(q) ||
      c.trade?.toLowerCase().includes(q) ||
      c.ref?.toLowerCase().includes(q) ||
      c.country?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q);
    const matchPayment = paymentFilter === "All" || c.paymentStatus === paymentFilter;
    const matchStatus = statusFilter === "All" || c.ppStatus === statusFilter;
    return matchSearch && matchStatus && matchPayment;
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "grey.100" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header + Controls */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1.5 }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>Candidate List</Typography>
            <Typography variant="caption" color="text.secondary">
              {filtered.length} of {candidates?.length || 0} candidates
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search name, passport, trade..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              sx={{ width: 220 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>PP Status</InputLabel>
              <Select value={statusFilter} label="PP Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <InputLabel>Payment</InputLabel>
              <Select value={paymentFilter} label="Payment" onChange={(e) => { setPaymentFilter(e.target.value); setPage(0); }}>
                {PAYMENT_OPTIONS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>
            <Tooltip title="Export to CSV">
              <IconButton
                onClick={() => exportCandidates(filtered)}
                sx={{ border: "1px solid", borderColor: "grey.300", borderRadius: 2 }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {showAddButton && onAdd && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddOpen(true)}
                sx={{ fontWeight: 700, borderRadius: 2, px: 2.5, whiteSpace: "nowrap" }}
              >
                Add Candidate
              </Button>
            )}
          </Box>
        </Box>

        {/* Table */}
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {["#", "Name", "Passport / Phone", "Country", "Pipeline Status", "PP Status", "Payment", "Actions"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: "text.secondary", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, bgcolor: "#fafafa" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((row, i) => {
                const expiring = isExpiringSoon(row.ppExp);
                const pipelineColors = PIPELINE_STATUS_COLORS[row.status] || { bg: "#F5F5F5", color: "#333" };
                return (
                  <TableRow
                    key={row.id || i}
                    sx={{
                      "&:hover": { bgcolor: "#F0F3FF" },
                      bgcolor: row.isNew ? "#f0fff4" : expiring ? "#fffde7" : "inherit",
                      transition: "background 0.15s",
                    }}
                  >
                    <TableCell sx={{ color: "text.disabled", fontSize: 12 }}>
                      {page * rowsPerPage + i + 1}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {row.isNew && (
                          <Chip label="NEW" size="small"
                            sx={{ bgcolor: "#DCFCE7", color: "#16A34A", fontSize: 9, height: 16, fontWeight: 700 }} />
                        )}
                        <Typography fontSize={13} fontWeight={600}>{row.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 12, color: "#3F51B5", fontWeight: 600 }}>
                      {row.passport || "—"}
                    </TableCell>
                    <TableCell>
                      <Chip label={row.country} size="small" variant="outlined"
                        sx={{ fontSize: 11, height: 20, borderRadius: 1 }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={row.status || "NEW"} size="small"
                        sx={{ fontWeight: 700, bgcolor: pipelineColors.bg, color: pipelineColors.color }} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <StatusChip status={row.ppStatus} />
                        {expiring && (
                          <Tooltip title={`PP Expiring: ${row.ppExp}`}>
                            <WarningAmberIcon sx={{ fontSize: 15, color: "#f57f17" }} />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: row.payment ? "#2e7d32" : "text.disabled", fontSize: 12 }}>
                      {row.payment ? `₹${row.payment.toLocaleString()}` : "—"}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.2 }}>
                        <Tooltip title="View Profile">
                          <IconButton size="small" sx={{ color: "#6a1b9a" }} onClick={() => setViewTarget(row)}>
                            <VisibilityIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" sx={{ color: "#3F51B5" }} onClick={() => setEditTarget(row)}>
                            <EditIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" sx={{ color: "#c62828" }} onClick={() => setDeleteTarget(row)}>
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No candidates found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRpp(+e.target.value); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </CardContent>

      {/* Add Modal */}
      <AddCandidateModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(c) => { onAdd && onAdd(c); setAddOpen(false); }}
        agents={agents || []}
      />

      {/* Edit Modal */}
      <EditCandidateModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        candidate={editTarget}
        agents={agents || []}
        onSave={(updated) => { onEdit && onEdit(updated); setEditTarget(null); }}
      />

      {/* Profile View */}
      <CandidateProfile
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        candidate={viewTarget}
        checkedDocs={docChecks?.[viewTarget?.id] || []}
        onDocToggle={onDocToggle}
        onEdit={() => { setEditTarget(viewTarget); setViewTarget(null); }}
      />

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: 380 } }}>
        <DialogContent sx={{ pt: 3 }}>
          <Typography fontWeight={700} fontSize={16} mb={1}>Delete Candidate?</Typography>
          <Typography color="text.secondary" fontSize={14}>
            Remove <strong>{deleteTarget?.name}</strong> ({deleteTarget?.passport}) from the list?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} variant="outlined" color="inherit">Cancel</Button>
          <Button
            onClick={() => { onDelete && onDelete(deleteTarget.id); setDeleteTarget(null); }}
            variant="contained" color="error" sx={{ fontWeight: 700 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
