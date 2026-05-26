import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Stack,
  Grid,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import axios from "axios";

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function DemandUploadPage() {
  const [demands, setDemands] = useState([]);
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDesc] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);

  /* ── Fetch existing demands ── */
  const fetchDemands = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/demand`);
      // Backend returns { success, demands } or plain array
      setDemands(res.data?.demands || res.data || []);
    } catch {
      setToast({ msg: "Failed to load demands", severity: "error" });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDemands();
  }, []);

  /* ── Image picker ── */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ── Upload ── */
  const handleUpload = async () => {
    if (!title.trim())
      return setToast({ msg: "Title is required", severity: "warning" });
    if (!country.trim())
      return setToast({ msg: "Country is required", severity: "warning" });
    if (!image)
      return setToast({ msg: "Please select an image", severity: "warning" });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("country", country);
    formData.append("salary", salary);
    formData.append("description", description);
    formData.append("deadline", deadline);
    formData.append("image", image);

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      await axios.post(`${BACKEND}/api/demand`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      setToast({ msg: " Demand uploaded successfully!", severity: "success" });
      // Reset form
      setTitle("");
      setCountry("");
      setSalary("");
      setDesc("");
      setDeadline("");
      setImage(null);
      setPreview(null);
      fetchDemands();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Upload failed";
      setToast({ msg: `❌ ${msg}`, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`${BACKEND}/api/demand/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setDemands((prev) => prev.filter((d) => d._id !== id));
      setToast({ msg: "🗑 Demand deleted", severity: "info" });
    } catch {
      setToast({ msg: "Delete failed", severity: "error" });
    }
  };

  return (
    <Box>
      {/* ── Upload Form Card ── */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2.5}>
            📤 Upload New Demand
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Job Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                size="small"
                placeholder="e.g. Construction Worker"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Country *"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                fullWidth
                size="small"
                placeholder="e.g. Saudi Arabia"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                fullWidth
                size="small"
                placeholder="e.g. SAR 1500/month"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDesc(e.target.value)}
                fullWidth
                size="small"
                multiline
                rows={2}
                placeholder="Job details, requirements..."
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  size="small"
                  sx={{ borderStyle: "dashed" }}
                >
                  Choose Image (PNG / JPG)
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
                {image && (
                  <Typography variant="caption" color="text.secondary">
                    {image.name}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Preview */}
            {preview && (
              <Grid item xs={12}>
                <Box
                  component="img"
                  src={preview}
                  alt="preview"
                  sx={{
                    height: 200,
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid #E5E7EB",
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <CloudUploadIcon />
                  )
                }
              >
                {loading ? "Uploading..." : "Upload Demand"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ── Active Demands List ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Active Demands
        </Typography>
        <Chip
          label={demands.length}
          size="small"
          sx={{
            bgcolor: "rgba(63,81,181,0.1)",
            color: "#3F51B5",
            fontWeight: 700,
          }}
        />
      </Box>

      {fetching ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : demands.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 5 }}>
            <Typography color="text.secondary">
              No demands uploaded yet.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {demands?.map((d) => (
            <Card
              key={d._id}
              sx={{
                display: "flex",
                alignItems: "stretch",
                overflow: "hidden",
              }}
            >
              {d.image && (
                <CardMedia
                  component="img"
                  image={`${BACKEND}/uploads/${d.image}`}
                  alt={d.title}
                  sx={{ width: 160, objectFit: "cover", flexShrink: 0 }}
                />
              )}
              <CardContent sx={{ flex: 1, py: 1.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography fontWeight={700} fontSize={15}>
                      {d.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        mt: 0.5,
                      }}
                    >
                      {d.country && (
                        <Chip
                          label={`🌍 ${d.country}`}
                          size="small"
                          sx={{
                            fontSize: 11,
                            bgcolor: "#EFF6FF",
                            color: "#1D4ED8",
                          }}
                        />
                      )}
                      {d.salary && (
                        <Chip
                          label={`💰 ${d.salary}`}
                          size="small"
                          sx={{
                            fontSize: 11,
                            bgcolor: "#F0FDF4",
                            color: "#15803D",
                          }}
                        />
                      )}
                      {d.deadline && (
                        <Chip
                          label={`⏰ ${new Date(d.deadline).toLocaleDateString()}`}
                          size="small"
                          sx={{
                            fontSize: 11,
                            bgcolor: "#FFF7ED",
                            color: "#C2410C",
                          }}
                        />
                      )}
                    </Box>
                    {d.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 0.5, maxWidth: 500 }}
                      >
                        {d.description}
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      Uploaded: {new Date(d.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleDelete(d._id)}
                    size="small"
                    sx={{
                      color: "#EF4444",
                      "&:hover": { bgcolor: "rgba(239,68,68,0.08)" },
                      flexShrink: 0,
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Toast */}
      <Snackbar
        open={!!toast}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast?.severity || "info"}
          onClose={() => setToast(null)}
          sx={{ borderRadius: 2 }}
        >
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
