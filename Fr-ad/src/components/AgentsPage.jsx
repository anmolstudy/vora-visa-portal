import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Avatar,
  Grid,
  Divider,
  Alert,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import GroupIcon from "@mui/icons-material/Group";
import PhoneIcon from "@mui/icons-material/Phone";
import SearchIcon from "@mui/icons-material/Search";

// Empty agent form
const emptyAgent = { name: "", phone: "", city: "", notes: "" };

export default function AgentsPage({ agents, onAgentsChange, candidates }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editAgent, setEditAgent] = useState(null); // null = add mode, obj = edit mode
  const [form, setForm] = useState(emptyAgent);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saved, setSaved] = useState(false);

  // Count how many candidates each agent has
  function candidateCount(agentName) {
    return (candidates || []).filter(
      (c) => c.ref?.toLowerCase().trim() === agentName?.toLowerCase().trim(),
    ).length;
  }

  // Open Add modal
  function openAdd() {
    setEditAgent(null);
    setForm(emptyAgent);
    setErrors({});
    setSaved(false);
    setModalOpen(true);
  }

  // Open Edit modal
  function openEdit(agent) {
    setEditAgent(agent);
    setForm({
      name: agent.name,
      phone: agent.phone || "",
      city: agent.city || "",
      notes: agent.notes || "",
    });
    setErrors({});
    setSaved(false);
    setModalOpen(true);
  }

  // Validate
  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Agent name is required";
    // Prevent duplicate names (except when editing same agent)
    const duplicate = agents.find(
      (a) =>
        a.name.toLowerCase() === form.name.trim().toLowerCase() &&
        a.id !== editAgent?.id,
    );
    if (duplicate) e.name = "Agent with this name already exists";
    return e;
  }

  // Save (add or edit)
  function handleSave() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    if (editAgent) {
      // Edit existing
      const updated = agents.map((a) =>
        a.id === editAgent.id ? { ...a, ...form, name: form.name.trim() } : a,
      );
      onAgentsChange(updated);
    } else {
      // Add new
      const newAgent = { id: Date.now(), ...form, name: form.name.trim() };
      onAgentsChange([...agents, newAgent]);
    }
    setSaved(true);
    setTimeout(() => setModalOpen(false), 700);
  }

  // Delete
  function handleDelete(id) {
    onAgentsChange(agents.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  }

  // Filtered list
  const filtered = agents.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.city?.toLowerCase().includes(search.toLowerCase()),
  );

  // Summary: top agents by candidate count
  const topAgents = [...agents]
    .map((a) => ({ ...a, count: candidateCount(a.name) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <Box>
      {/* Top agent cards */}
      <Grid container spacing={2} mb={3}>
        {topAgents.map((a, i) => (
          <Grid item xs={12} sm={6} md={3} key={a.id}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.100",
                "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
                transition: "all 0.2s",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: ["#1565c0", "#6a1b9a", "#2e7d32", "#e65100"][i],
                      width: 38,
                      height: 38,
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    {a.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={700} fontSize={14}>
                      {a.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {a.city || "Agent"}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h5" fontWeight={800} color="primary">
                  {a.count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  candidates referred
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Full agents table */}
      <Card
        elevation={0}
        sx={{ borderRadius: 3, border: "1px solid", borderColor: "grey.100" }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2.5,
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Agent List
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {agents.length} agents registered
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <TextField
                size="small"
                placeholder="Search agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              {/* ADD AGENT button */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openAdd}
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 2.5,
                  whiteSpace: "nowrap",
                }}
              >
                Add Agent
              </Button>
            </Box>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {[
                    "#",
                    "Agent Name",
                    "Phone",
                    "City",
                    "Candidates",
                    "Notes",
                    "Actions",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: 700,
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        color: "text.secondary",
                        bgcolor: "#fafafa",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((agent, i) => (
                  <TableRow
                    key={agent.id}
                    sx={{ "&:hover": { bgcolor: "#F0F3FF" } }}
                  >
                    {" "}
                    <TableCell sx={{ fontSize: 12, color: "text.disabled" }}>
                      {i + 1}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#3F51B5",
                            width: 28,
                            height: 28,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {agent.name.charAt(0)}
                        </Avatar>
                        <Typography fontSize={13} fontWeight={700}>
                          {agent.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>
                      {agent.phone ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <PhoneIcon
                            sx={{ fontSize: 13, color: "text.secondary" }}
                          />
                          {agent.phone}
                        </Box>
                      ) : (
                        <Typography color="text.disabled" fontSize={12}>
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>
                      {agent.city || "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${candidateCount(agent.name)} candidates`}
                        size="small"
                        sx={{
                          bgcolor:
                            candidateCount(agent.name) > 0
                              ? "#e3f2fd"
                              : "#f5f5f5",
                          color:
                            candidateCount(agent.name) > 0
                              ? "#1565c0"
                              : "#9e9e9e",
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                        maxWidth: 150,
                      }}
                    >
                      {agent.notes?.slice(0, 40)}
                      {agent.notes?.length > 40 ? "…" : ""}
                      {!agent.notes && "—"}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <IconButton
                          size="small"
                          sx={{ color: "#3F51B5" }}
                          onClick={() => openEdit(agent)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "#EF4444" }}
                          onClick={() => setDeleteConfirm(agent)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      No agents found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* ── ADD / EDIT AGENT MODAL ── */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}
        >
          <Box
            sx={{
              bgcolor: "#f3e5f5",
              p: 1,
              borderRadius: 2,
              color: "#6a1b9a",
              display: "flex",
            }}
          >
            <GroupIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {editAgent ? "Edit Agent" : "Add New Agent"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Agent details
            </Typography>
          </Box>
          <IconButton onClick={() => setModalOpen(false)} sx={{ ml: "auto" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          {saved && (
            <Alert severity="success" sx={{ mb: 2 }}>
              ✅ Agent {editAgent ? "updated" : "added"} successfully!
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Agent Name *"
                size="small"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                error={!!errors.name}
                helperText={errors.name}
                placeholder="e.g. Lucky Sandhu"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                size="small"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="e.g. 9876543210"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City / Location"
                size="small"
                value={form.city}
                onChange={(e) =>
                  setForm((p) => ({ ...p, city: e.target.value }))
                }
                placeholder="e.g. Ludhiana"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                size="small"
                multiline
                rows={2}
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="Any notes about this agent..."
              />
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setModalOpen(false)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ fontWeight: 700, px: 3 }}
          >
            {editAgent ? "Update Agent" : "Add Agent"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── DELETE CONFIRM ── */}
      <Dialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: 380 } }}
      >
        <DialogContent sx={{ pt: 3 }}>
          <Typography fontWeight={700} fontSize={16} mb={1}>
            Delete Agent?
          </Typography>
          <Typography color="text.secondary" fontSize={14}>
            Remove <strong>{deleteConfirm?.name}</strong> from the agent list?
            This won't affect existing candidates.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteConfirm(null)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(deleteConfirm.id)}
            variant="contained"
            color="error"
            sx={{ fontWeight: 700 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
