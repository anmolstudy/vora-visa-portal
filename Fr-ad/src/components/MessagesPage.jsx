import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import API from "../services/api";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: "" });
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const fetchMessages = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await API.get("/contact");
      setMessages(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setToast({ open: true, message: "Failed to load messages", severity: "error" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async () => {
    const { id } = deleteDialog;
    try {
      await API.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      setToast({ open: true, message: "Message deleted successfully", severity: "success" });
    } catch (err) {
      console.error("Delete error:", err);
      setToast({ open: true, message: "Failed to delete message", severity: "error" });
    } finally {
      setDeleteDialog({ open: false, id: null, name: "" });
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await API.patch(`/contact/${id}/read`);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead: true } : m))
      );
      setToast({ open: true, message: "Marked as read", severity: "info" });
    } catch (err) {
      console.error("Mark as read error:", err);
      setToast({ open: true, message: "Failed to mark as read", severity: "error" });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <EmailIcon sx={{ color: "#3F51B5" }} />
          <Typography variant="h6" fontWeight={700}>
            Contact Messages
          </Typography>
          <Chip
            label={messages.length}
            size="small"
            sx={{
              bgcolor: "rgba(63,81,181,0.1)",
              color: "#3F51B5",
              fontWeight: 700,
            }}
          />
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} unread`}
              size="small"
              sx={{
                bgcolor: "rgba(239,68,68,0.1)",
                color: "#EF4444",
                fontWeight: 600,
              }}
            />
          )}
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
          onClick={() => fetchMessages(true)}
          disabled={refreshing}
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {/* Messages List */}
      {messages.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <EmailIcon sx={{ fontSize: 48, color: "#D1D5DB", mb: 2 }} />
            <Typography color="text.secondary" fontWeight={500}>
              No messages yet
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Messages from contact form will appear here
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {messages.map((m) => (
            <Card
              key={m._id}
              sx={{
                borderLeft: m.isRead ? "4px solid #D1D5DB" : "4px solid #3F51B5",
                bgcolor: m.isRead ? "#FAFAFA" : "#FFFFFF",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent sx={{ pb: "16px !important" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    {/* Name and badges */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <PersonIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                      <Typography fontWeight={700} fontSize={15}>
                        {m.name}
                      </Typography>
                      {!m.isRead && (
                        <Chip
                          label="New"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: 10,
                            bgcolor: "#3F51B5",
                            color: "#fff",
                            fontWeight: 700,
                          }}
                        />
                      )}
                    </Box>

                    {/* Contact info chips */}
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
                      <Chip
                        icon={<EmailIcon sx={{ fontSize: "14px !important" }} />}
                        label={m.email}
                        size="small"
                        sx={{
                          fontSize: 11,
                          bgcolor: "#EFF6FF",
                          color: "#1D4ED8",
                          "& .MuiChip-icon": { color: "#1D4ED8" },
                        }}
                      />
                      {m.phone && (
                        <Chip
                          icon={<PhoneIcon sx={{ fontSize: "14px !important" }} />}
                          label={m.phone}
                          size="small"
                          sx={{
                            fontSize: 11,
                            bgcolor: "#F0FDF4",
                            color: "#15803D",
                            "& .MuiChip-icon": { color: "#15803D" },
                          }}
                        />
                      )}
                      {m.reason && (
                        <Chip
                          label={m.reason}
                          size="small"
                          sx={{
                            fontSize: 11,
                            bgcolor: "#FAF5FF",
                            color: "#7E22CE",
                          }}
                        />
                      )}
                    </Box>

                    {/* Message */}
                    <Divider sx={{ my: 1.5 }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {m.message}
                    </Typography>

                    {/* Timestamp */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: "#9CA3AF" }} />
                      <Typography variant="caption" color="text.disabled">
                        {formatDate(m.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    {!m.isRead && (
                      <Tooltip title="Mark as read">
                        <IconButton
                          size="small"
                          onClick={() => handleMarkAsRead(m._id)}
                          sx={{
                            color: "#6B7280",
                            "&:hover": { bgcolor: "rgba(63,81,181,0.1)", color: "#3F51B5" },
                          }}
                        >
                          <MarkEmailReadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete message">
                      <IconButton
                        size="small"
                        onClick={() => setDeleteDialog({ open: true, id: m._id, name: m.name })}
                        sx={{
                          color: "#6B7280",
                          "&:hover": { bgcolor: "rgba(239,68,68,0.1)", color: "#EF4444" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, name: "" })}
      >
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the message from <strong>{deleteDialog.name}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null, name: "" })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
