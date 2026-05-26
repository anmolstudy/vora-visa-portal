import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem, Select, FormControl,
  InputLabel, Typography, Box, Divider, IconButton, Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Autocomplete } from "@mui/material";

const PP_STATUSES = ["IN MAIL", "IN OFFICE", "COURIER", "AT DELHI", "COURIER TO MS OFFICE"];
const VISA_STATUS = ["", "OK", "PENDING", "REJECTED", "NOT APPLIED"];
// const COUNTRIES = ["Dubai", "Kuwait", "Romania", "Croatia", "Bulgaria", "Russia", "Other"];
const COUNTRIES = [
  // Gulf / Middle East
  "Dubai", "Abu Dhabi", "Sharjah", "Kuwait", "Qatar", "Bahrain", "Oman", "Saudi Arabia", "Jordan",
  // Europe — Eastern & Balkan
  "Romania", "Croatia", "Bulgaria", "Serbia", "Bosnia", "Slovenia", "Slovakia", "Hungary", "Poland", "Czech Republic",
  // CIS / Eastern Europe
  "Russia", "Ukraine", "Moldova", "Georgia", "Azerbaijan", "Kazakhstan", "Uzbekistan",
  // Western Europe
  "Germany", "Italy", "Spain", "Portugal", "France", "Netherlands", "Belgium", "Austria", "Switzerland",
  // Other
  "Malta", "Cyprus", "Singapore", "Malaysia", "Other",
];
const TRADES = [
  "WAREHOUSE HELPER", "HELPER", "STEEL FIXER", "WALL PAINTER", "SHUTTERING CARPENTER",
  "AGRICULTURE WORKER", "VEGETABLE & FRUIT PROCESSING", "MASON", "PACKING HELPER",
  "HEAVY DRIVER", "TAXI DRIVER", "TAILOR", "SEASONAL", "CLEANER", "UNSKILLED", "Tourist Visa",
  "Work Visa", "Student Visa", "Business Visa", "Transit Visa", "Other",
];

const emptyForm = {
  name: "",
  passport: "",
  trade: "",
  ref: "",
  country: "",
  ppStatus: "IN MAIL",
  visa: "",
  payment: "",
  ppExp: "",
  subDate: "",
  status: "NEW",
  email: "",
  phone: "",
  message: "",
};

export default function AddCandidateModal({ open, onClose, onSave, agents }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setErrors({});
      setSaved(false);
    }
  }, [open]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.country) e.country = "Select a country";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    const newCandidate = {
      id: Date.now(),
      name: form.name.trim().toUpperCase(),
      passport: form.passport.trim().toUpperCase(),
      country: form.country,
      trade: form.trade,
      ref: form.ref,
      email: form.email || "",
      phone: form.phone || "",
      message: form.message || "",
      source: "admin",
      createdAt: new Date(),
      status: form.status || "NEW",
      ppStatus: form.ppStatus,
      visa: form.visa || null,
      payment: form.payment ? Number(form.payment) : 0,
      paymentStatus: form.payment ? "PAID" : "PENDING",
      ppExp: form.ppExp || null,
      subDate: form.subDate || null,
    };

    setSaved(true);
    onSave(newCandidate);
    setTimeout(() => onClose(), 800);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
        <Box sx={{ bgcolor: "#EEF0FB", p: 1, borderRadius: 2, color: "#3F51B5", display: "flex" }}>
          <PersonAddIcon />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700}>Add New Candidate</Typography>
          <Typography variant="caption" color="text.secondary">Fill in candidate details below</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ ml: "auto" }}><CloseIcon /></IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {saved && <Alert severity="success" sx={{ mb: 2 }}>Candidate added successfully!</Alert>}

        <Grid container spacing={2.5}>
          {/* Basic Info */}
          <Grid item xs={12}>
            <Typography variant="overline" color="text.secondary" fontWeight={700}>Basic Information</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Full Name *" size="small"
              value={form.name} onChange={(e) => handleChange("name", e.target.value)}
              error={!!errors.name} helperText={errors.name}
              placeholder="e.g. GURPREET SINGH"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Passport No." size="small"
              value={form.passport} onChange={(e) => handleChange("passport", e.target.value)}
              placeholder="e.g. V3759450"
              inputProps={{ style: { fontFamily: "monospace", textTransform: "uppercase" } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Email" size="small" type="email"
              value={form.email} onChange={(e) => handleChange("email", e.target.value)}
              error={!!errors.email} helperText={errors.email}
              placeholder="candidate@example.com"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Phone" size="small" type="tel"
              value={form.phone} onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="e.g. 9876543210"
            />
          </Grid>

          {/* Country */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              freeSolo
              options={COUNTRIES}
              value={form.country || ""}
              onChange={(e, v) => handleChange("country", v || "")}
              onInputChange={(e, v) => handleChange("country", v || "")}
              renderInput={(params) => (
                <TextField {...params} fullWidth label="Country *" size="small"
                  error={!!errors.country} helperText={errors.country} />
              )}
            />
          </Grid>

          {/* Agent & Status */}
          <Grid item xs={12}>
            <Divider>
              <Typography variant="overline" color="text.secondary" fontWeight={700}>Agent & Status</Typography>
            </Divider>
          </Grid>

          {/* <Grid item xs={12} sm={6}>
            <Autocomplete
              freeSolo
              options={(agents || []).map((a) => a.name)}
              value={form.ref || ""}
              onChange={(e, v) => handleChange("ref", v || "")}
              onInputChange={(e, v) => handleChange("ref", v || "")}
              renderInput={(params) => <TextField {...params} label="Agent / Ref" size="small" />}
            />
          </Grid> */}

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Passport Status</InputLabel>
              <Select value={form.ppStatus} label="Passport Status"
                onChange={(e) => handleChange("ppStatus", e.target.value)}>
                {PP_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Visa Status</InputLabel>
              <Select value={form.visa} label="Visa Status"
                onChange={(e) => handleChange("visa", e.target.value)}>
                {VISA_STATUS.map((s) => (
                  <MenuItem key={s} value={s}>{s || "— Not Set —"}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Payment Received (₹)" size="small" type="number"
              value={form.payment} onChange={(e) => handleChange("payment", e.target.value)}
              placeholder="e.g. 30000"
              InputProps={{
                startAdornment: <Typography sx={{ mr: 0.5, color: "text.secondary" }}>₹</Typography>,
              }}
            />
          </Grid>

          {/* Dates */}
          <Grid item xs={12}>
            <Divider>
              <Typography variant="overline" color="text.secondary" fontWeight={700}>Dates</Typography>
            </Divider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Passport Expiry Date" size="small" type="date"
              value={form.ppExp} onChange={(e) => handleChange("ppExp", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Submission Date" size="small" type="date"
              value={form.subDate} onChange={(e) => handleChange("subDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth label="Notes / Message" size="small" multiline rows={2}
              value={form.message} onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Any additional information..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<PersonAddIcon />}
          sx={{ px: 3, fontWeight: 700 }}
        >
          Save Candidate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
