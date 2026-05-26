import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Avatar,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  Search,
  ExpandMore,
  DragHandle,
  CheckCircle,
  Cancel,
  Flight,
  Public,
  Security,
  Speed,
  EmojiEvents,
  SupportAgent,
  ThumbUp,
  AccessTime,
  Save,
  Close,
} from "@mui/icons-material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";

// ── Theme (matches main site) ─────────────────────────────────────────────────//
const theme = createTheme({
  palette: {
    primary: { main: "#0da12b", light: "#19d251", dark: "#00711e" },
    secondary: { main: "#ff00b3", light: "#ff00cc", dark: "#593555" },
    background: { default: "#F8FAFF", paper: "#FFFFFF" },
  },
  typography: {
    fontFamily: "'Lato', sans-serif",
    button: { fontWeight: 700, letterSpacing: 0.5 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, backgroundColor: "#F0F4FF", color: "#0D47A1" },
      },
    },
  },
});

// ── Initial seed data (mirrors servicesData.js shape) ────────────────────────
const CATEGORY_OPTIONS = [
  "All",
  "Passport",
  "Visa",
  "Attestation",
  "Translation",
];
const COLOR_OPTIONS = [
  { label: "Green", value: "#2E7D32" },
  { label: "Pink", value: "#e600a9" },
  { label: "Purple", value: "#6A1B9A" },
  { label: "Teal", value: "#00695C" },
  { label: "Red2", value: "#c628a1" },
];

const INITIAL_SERVICES = [
  {
    id: 1,
    active: true,
    title: "Passport Application (Fresh)",
    category: "Passport",
    short: "Apply for a brand-new Indian passport with full document support.",
    description:
      "We handle end-to-end fresh passport processing including form fill, document verification, and appointment booking.",
    time: "7–10 working days",
    price: "₹2,000",
    color: "#1565C0",
    sub: [
      "Form filling assistance",
      "Document checklist",
      "Appointment booking",
      "Status tracking",
    ],
    docs: [
      "Birth certificate",
      "Address proof (Aadhaar/utility)",
      "Photo ID",
      "2 passport-size photos",
    ],
  },
  {
    id: 2,
    active: true,
    title: "Passport Renewal",
    category: "Passport",
    short: "Hassle-free renewal for expired or about-to-expire passports.",
    description:
      "Complete renewal service with old passport verification and express options available.",
    time: "5–7 working days",
    price: "₹1,299",
    color: "#26c015",
    sub: [
      "Renewal form submission",
      "Old passport review",
      "Document checklist",
      "Appointment coordination",
    ],
    docs: [
      "Old passport (original)",
      "Address proof",
      "Photo ID",
      "2 passport-size photos",
    ],
  },
  {
    id: 3,
    active: true,
    title: "Tourist Visa – Schengen",
    category: "Visa",
    short: "Visit 26 European countries on a single visa.",
    description:
      "Professional assistance for Schengen tourist visa with consulate submission and interview prep.",
    time: "15–20 working days",
    price: "₹4,999",
    color: "#2E7D32",
    sub: [
      "Application form",
      "Cover letter drafting",
      "Bank statement review",
      "Consulate submission",
    ],
    docs: [
      "6-month bank statement",
      "ITR (2 years)",
      "Hotel bookings",
      "Flight itinerary",
      "Travel insurance",
    ],
  },
  {
    id: 4,
    active: false,
    title: "Work Visa – Canada",
    category: "Visa",
    short: "Expert guidance for Canadian work permit applications.",
    description:
      "Full-service work permit processing for Canada including Express Entry support.",
    time: "30–45 working days",
    price: "₹8,999",
    color: "#e60099",
    sub: [
      "LMIA review",
      "Express Entry profile",
      "Document checklist",
      "Embassy liaison",
    ],
    docs: [
      "Job offer letter",
      "Educational certificates",
      "Work experience letters",
      "Medical certificate",
    ],
  },
  {
    id: 5,
    active: true,
    title: "Document Attestation",
    category: "Attestation",
    short: "State, MEA and embassy attestation for all documents.",
    description:
      "Complete attestation chain for educational, personal, and commercial documents.",
    time: "10–15 working days",
    price: "₹2,499",
    color: "#6A1B9A",
    sub: [
      "State HRD attestation",
      "MEA attestation",
      "Embassy attestation",
      "Apostille",
    ],
    docs: [
      "Original documents",
      "Notarized copies",
      "Covering letter",
      "Photo ID",
    ],
  },
];

const INITIAL_PACKAGES = [
  {
    id: 1,
    title: "Basic",
    price: "₹999",
    popular: false,
    color: "#49c112",
    features: [
      "1 service type",
      "Standard processing",
      "Email updates",
      "Digital delivery",
    ],
  },
  {
    id: 2,
    title: "Standard",
    price: "₹2,499",
    popular: true,
    color: "#ff0084",
    features: [
      "Up to 3 services",
      "Priority processing",
      "WhatsApp + Email updates",
      "Home pickup (local)",
      "Dedicated agent",
    ],
  },
  {
    id: 3,
    title: "Premium",
    price: "₹4,999",
    popular: false,
    color: "#2E7D32",
    features: [
      "Unlimited services",
      "Express processing",
      "24/7 WhatsApp support",
      "Doorstep pickup & delivery",
      "Dedicated concierge",
      "Airport priority stamp",
    ],
  },
];

const INITIAL_STEPS = [
  {
    id: 1,
    label: "Consultation",
    desc: "Call or WhatsApp us. Our expert understands your requirement and recommends the right service.",
  },
  {
    id: 2,
    label: "Document Collection",
    desc: "We send you a precise checklist. You share scanned copies via WhatsApp or email.",
  },
  {
    id: 3,
    label: "Application Filing",
    desc: "We prepare, verify, and file your application with the relevant authority or consulate.",
  },
  {
    id: 4,
    label: "Status Tracking",
    desc: "Get real-time updates via WhatsApp. We follow up with authorities on your behalf.",
  },
  {
    id: 5,
    label: "Delivery",
    desc: "Your processed document is delivered to your doorstep or collected from our office.",
  },
];

const INITIAL_FAQS = [
  {
    id: 1,
    q: "How long does a fresh passport take?",
    a: "Typically 7–10 working days under normal processing. Tatkal takes 1–3 days.",
  },
  {
    id: 2,
    q: "Do I need to visit your office?",
    a: "Not necessarily. Most services can be done remotely. We arrange pickup for originals when needed.",
  },
  {
    id: 3,
    q: "Which countries do you cover for visas?",
    a: "We cover 25+ countries including USA, UK, Schengen, Canada, Australia, UAE, and Southeast Asia.",
  },
  {
    id: 4,
    q: "Is my data safe with you?",
    a: "Yes. All documents are handled with strict confidentiality and deleted after service completion.",
  },
  {
    id: 5,
    q: "Do you offer Tatkal passport services?",
    a: "Yes, we offer Tatkal processing with an additional government fee applicable.",
  },
];

const INITIAL_STATS = [
  { id: 1, value: "15,000+", label: "Happy Clients" },
  { id: 2, value: "98%", label: "Success Rate" },
  { id: 3, value: "10+ Yrs", label: "Experience" },
  { id: 4, value: "25+", label: "Countries" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function StatusChip({ active }) {
  return (
    <Chip
      label={active ? "Active" : "Draft"}
      size="small"
      sx={{
        bgcolor: active ? alpha("#2E7D32", 0.12) : alpha("#FF6F00", 0.12),
        color: active ? "#2E7D32" : "#E65100",
        fontWeight: 700,
        fontSize: "0.72rem",
      }}
    />
  );
}

function ColorDot({ color }) {
  return (
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        bgcolor: color,
        display: "inline-block",
        mr: 1,
        verticalAlign: "middle",
      }}
    />
  );
}

function SectionHeader({ title, subtitle, onAdd, addLabel = "Add" }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={700} color="primary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {onAdd && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAdd}
          color="primary"
        >
          {addLabel}
        </Button>
      )}
    </Box>
  );
}

// ── Empty service/package/step/faq templates ──────────────────────────────────
const emptyService = () => ({
  id: Date.now(),
  active: true,
  title: "",
  category: "Passport",
  short: "",
  description: "",
  time: "",
  price: "",
  color: "#1565C0",
  sub: [""],
  docs: [""],
});
const emptyPackage = () => ({
  id: Date.now(),
  title: "",
  price: "",
  popular: false,
  color: "#0D47A1",
  features: [""],
});
const emptyStep = () => ({ id: Date.now(), label: "", desc: "" });
const emptyFaq = () => ({ id: Date.now(), q: "", a: "" });
const emptyStat = () => ({ id: Date.now(), value: "", label: "" });

// ════════════════════════════════════════════════════════════════════════════
//  TAB 1 — Services
// ════════════════════════════════════════════════════════════════════════════
function ServicesTab() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [editItem, setEditItem] = useState(null); // null = closed
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = useMemo(
    () =>
      services.filter(
        (s) =>
          (catFilter === "All" || s.category === catFilter) &&
          s.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [services, search, catFilter],
  );

  const openNew = () => {
    setEditItem(emptyService());
    setIsNew(true);
  };
  const openEdit = (s) => {
    setEditItem({ ...s, sub: [...s.sub], docs: [...s.docs] });
    setIsNew(false);
  };

  const save = () => {
    if (isNew) {
      setServices((p) => [...p, editItem]);
    } else {
      setServices((p) => p.map((s) => (s.id === editItem.id ? editItem : s)));
    }
    setEditItem(null);
  };

  const deleteService = (id) => {
    setServices((p) => p.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  };

  const toggleActive = (id) =>
    setServices((p) =>
      p.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
    );

  // tag helpers
  const setArrayItem = (field, idx, val) =>
    setEditItem((p) => {
      const arr = [...p[field]];
      arr[idx] = val;
      return { ...p, [field]: arr };
    });
  const addArrayItem = (field) =>
    setEditItem((p) => ({ ...p, [field]: [...p[field], ""] }));
  const removeArrayItem = (field, idx) =>
    setEditItem((p) => ({
      ...p,
      [field]: p[field].filter((_, i) => i !== idx),
    }));

  return (
    <Box>
      <SectionHeader
        title="Services"
        subtitle={`${services.filter((s) => s.active).length} active · ${services.filter((s) => !s.active).length} drafts`}
        onAdd={openNew}
        addLabel="Add Service"
      />

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search services…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: 260 }}
        />
        <Select
          size="small"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {CATEGORY_OPTIONS.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ alignSelf: "center", ml: 1 }}
        >
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Service Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ColorDot color={s.color} />
                    <Typography variant="body2" fontWeight={600}>
                      {s.title}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={s.category}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: s.color,
                      color: s.color,
                      fontSize: "0.7rem",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{s.price}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTime sx={{ fontSize: 14, color: "text.disabled" }} />
                    <Typography variant="body2">{s.time}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <StatusChip active={s.active} />
                    <Switch
                      size="small"
                      checked={s.active}
                      onChange={() => toggleActive(s.id)}
                      color="success"
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => openEdit(s)}
                      color="primary"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => setDeleteConfirm(s.id)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No services found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Edit / Add Dialog ── */}
      <Dialog
        open={!!editItem}
        onClose={() => setEditItem(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {isNew ? "Add New Service" : "Edit Service"}
          </Typography>
          <IconButton onClick={() => setEditItem(null)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider />
        {editItem && (
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              {/* Row 1 */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Service Title *"
                  value={editItem.title}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <Select
                  fullWidth
                  size="small"
                  value={editItem.category}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, category: e.target.value }))
                  }
                >
                  {CATEGORY_OPTIONS.filter((c) => c !== "All").map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={6} md={3}>
                <Select
                  fullWidth
                  size="small"
                  value={editItem.color}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, color: e.target.value }))
                  }
                  renderValue={(v) => (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ColorDot color={v} />
                      {COLOR_OPTIONS.find((c) => c.value === v)?.label || v}
                    </Box>
                  )}
                >
                  {COLOR_OPTIONS.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      <ColorDot color={c.value} />
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Row 2 */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Price (e.g. ₹1,499)"
                  value={editItem.price}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, price: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Processing Time"
                  value={editItem.time}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, time: e.target.value }))
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={editItem.active}
                      onChange={(e) =>
                        setEditItem((p) => ({ ...p, active: e.target.checked }))
                      }
                      color="success"
                    />
                  }
                  label={
                    editItem.active
                      ? "Active (visible on site)"
                      : "Draft (hidden)"
                  }
                />
              </Grid>

              {/* Short description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Short description (shown on card)"
                  value={editItem.short}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, short: e.target.value }))
                  }
                />
              </Grid>

              {/* Full description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Full description (shown in overlay)"
                  multiline
                  rows={3}
                  value={editItem.description}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </Grid>

              {/* Sub-services */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={700}>
                    Sub-services included
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<Add />}
                    onClick={() => addArrayItem("sub")}
                  >
                    Add
                  </Button>
                </Box>
                {editItem.sub.map((s, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={s}
                      placeholder={`Sub-service ${i + 1}`}
                      onChange={(e) => setArrayItem("sub", i, e.target.value)}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeArrayItem("sub", i)}
                      disabled={editItem.sub.length === 1}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Grid>

              {/* Documents */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={700}>
                    Documents required
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<Add />}
                    onClick={() => addArrayItem("docs")}
                  >
                    Add
                  </Button>
                </Box>
                {editItem.docs.map((d, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={d}
                      placeholder={`Document ${i + 1}`}
                      onChange={(e) => setArrayItem("docs", i, e.target.value)}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeArrayItem("docs", i)}
                      disabled={editItem.docs.length === 1}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setEditItem(null)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={save}
            variant="contained"
            startIcon={<Save />}
            disabled={!editItem?.title}
          >
            {isNew ? "Create Service" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete service?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            This will permanently remove the service from your site. This cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirm(null)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteService(deleteConfirm)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  TAB 2 — Packages
// ════════════════════════════════════════════════════════════════════════════
function PackagesTab() {
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [editItem, setEditItem] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const openEdit = (p) => {
    setEditItem({ ...p, features: [...p.features] });
    setIsNew(false);
  };
  const openNew = () => {
    setEditItem(emptyPackage());
    setIsNew(true);
  };

  const save = () => {
    if (isNew) setPackages((p) => [...p, editItem]);
    else
      setPackages((p) =>
        p.map((pkg) => (pkg.id === editItem.id ? editItem : pkg)),
      );
    setEditItem(null);
  };

  const markPopular = (id) =>
    setPackages((p) => p.map((pkg) => ({ ...pkg, popular: pkg.id === id })));

  const addFeature = () =>
    setEditItem((p) => ({ ...p, features: [...p.features, ""] }));
  const setFeature = (i, v) =>
    setEditItem((p) => {
      const f = [...p.features];
      f[i] = v;
      return { ...p, features: f };
    });
  const removeFeature = (i) =>
    setEditItem((p) => ({
      ...p,
      features: p.features.filter((_, idx) => idx !== i),
    }));

  return (
    <Box>
      <SectionHeader
        title="Service Packages"
        subtitle="Manage pricing tiers shown on the services page"
        onAdd={openNew}
        addLabel="Add Package"
      />

      <Grid container spacing={3}>
        {packages.map((pkg) => (
          <Grid item xs={12} md={4} key={pkg.id}>
            <Card
              sx={{
                height: "100%",
                border: pkg.popular ? "2px solid" : "1px solid",
                borderColor: pkg.popular ? "secondary.main" : "divider",
                position: "relative",
              }}
            >
              {pkg.popular && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 20,
                    bgcolor: "secondary.main",
                    color: "white",
                    px: 1.5,
                    py: 0.4,
                    borderRadius: "0 0 8px 8px",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                  }}
                >
                  MOST POPULAR
                </Box>
              )}
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography variant="h5" fontWeight={700} color="primary">
                    {pkg.title || "Untitled"}
                  </Typography>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => openEdit(pkg)}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setPackages((p) => p.filter((x) => x.id !== pkg.id))
                        }
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography
                  variant="h3"
                  sx={{ color: pkg.color, fontWeight: 800, mb: 0.5 }}
                >
                  {pkg.price}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  starting from
                </Typography>
                <Divider sx={{ my: 2 }} />
                <List dense disablePadding>
                  {pkg.features.map((f, i) => (
                    <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                      <CheckCircle
                        sx={{ fontSize: 14, color: pkg.color, mr: 1 }}
                      />
                      <ListItemText
                        primary={f}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2 }}>
                  {!pkg.popular && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onClick={() => markPopular(pkg.id)}
                    >
                      Mark as Popular
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog
        open={!!editItem}
        onClose={() => setEditItem(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {isNew ? "Add Package" : "Edit Package"}
          </Typography>
          <IconButton onClick={() => setEditItem(null)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider />
        {editItem && (
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Package Name"
                  value={editItem.title}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Starting Price (e.g. ₹999)"
                  value={editItem.price}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, price: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Select
                  fullWidth
                  size="small"
                  value={editItem.color}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, color: e.target.value }))
                  }
                  renderValue={(v) => (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ColorDot color={v} />
                      {COLOR_OPTIONS.find((c) => c.value === v)?.label || v}
                    </Box>
                  )}
                >
                  {COLOR_OPTIONS.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      <ColorDot color={c.value} />
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editItem.popular}
                      onChange={(e) =>
                        setEditItem((p) => ({
                          ...p,
                          popular: e.target.checked,
                        }))
                      }
                      color="warning"
                    />
                  }
                  label="Show as Most Popular"
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={700}>
                    Features list
                  </Typography>
                  <Button size="small" startIcon={<Add />} onClick={addFeature}>
                    Add feature
                  </Button>
                </Box>
                {editItem.features.map((f, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={f}
                      placeholder={`Feature ${i + 1}`}
                      onChange={(e) => setFeature(i, e.target.value)}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeFeature(i)}
                      disabled={editItem.features.length === 1}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setEditItem(null)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={save}
            variant="contained"
            startIcon={<Save />}
            disabled={!editItem?.title}
          >
            {isNew ? "Create Package" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  TAB 3 — Process Steps
// ════════════════════════════════════════════════════════════════════════════
function ProcessTab() {
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [editItem, setEditItem] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const openEdit = (s) => {
    setEditItem({ ...s });
    setIsNew(false);
  };
  const openNew = () => {
    setEditItem(emptyStep());
    setIsNew(true);
  };

  const save = () => {
    if (isNew) setSteps((p) => [...p, editItem]);
    else setSteps((p) => p.map((s) => (s.id === editItem.id ? editItem : s)));
    setEditItem(null);
  };

  const moveUp = (i) => {
    if (i === 0) return;
    const a = [...steps];
    [a[i - 1], a[i]] = [a[i], a[i - 1]];
    setSteps(a);
  };
  const moveDown = (i) => {
    if (i === steps.length - 1) return;
    const a = [...steps];
    [a[i], a[i + 1]] = [a[i + 1], a[i]];
    setSteps(a);
  };

  return (
    <Box>
      <SectionHeader
        title="Process Steps"
        subtitle="The 'How It Works' section on the services page"
        onAdd={openNew}
        addLabel="Add Step"
      />

      <Paper elevation={1} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {steps.map((step, i) => (
          <Box
            key={step.id}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              p: 2.5,
              borderBottom: i < steps.length - 1 ? "1px solid" : "none",
              borderColor: "divider",
              "&:hover": { bgcolor: "#F8FAFF" },
            }}
          >
            <Avatar
              sx={{
                bgcolor: i % 2 === 0 ? "primary.main" : "secondary.main",
                width: 36,
                height: 36,
                fontSize: "0.85rem",
                fontWeight: 700,
                mt: 0.5,
              }}
            >
              {i + 1}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} color="primary">
                {step.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.desc}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Tooltip title="Move up">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    sx={{ fontSize: "1rem", lineHeight: 1 }}
                  >
                    ↑
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Move down">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => moveDown(i)}
                    disabled={i === steps.length - 1}
                    sx={{ fontSize: "1rem", lineHeight: 1 }}
                  >
                    ↓
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => openEdit(step)}
                color="primary"
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() =>
                  setSteps((p) => p.filter((s) => s.id !== step.id))
                }
                color="error"
                disabled={steps.length === 1}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Paper>

      <Dialog
        open={!!editItem}
        onClose={() => setEditItem(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {isNew ? "Add Step" : "Edit Step"}
          </Typography>
          <IconButton onClick={() => setEditItem(null)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider />
        {editItem && (
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Step title"
              value={editItem.label}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, label: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Description"
              multiline
              rows={3}
              value={editItem.desc}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, desc: e.target.value }))
              }
            />
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setEditItem(null)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={save}
            variant="contained"
            startIcon={<Save />}
            disabled={!editItem?.label}
          >
            {isNew ? "Add Step" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  TAB 4 — FAQs
// ════════════════════════════════════════════════════════════════════════════
function FAQsTab() {
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [editItem, setEditItem] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const openEdit = (f) => {
    setEditItem({ ...f });
    setIsNew(false);
  };
  const openNew = () => {
    setEditItem(emptyFaq());
    setIsNew(true);
  };

  const save = () => {
    if (isNew) setFaqs((p) => [...p, editItem]);
    else setFaqs((p) => p.map((f) => (f.id === editItem.id ? editItem : f)));
    setEditItem(null);
  };

  return (
    <Box>
      <SectionHeader
        title="FAQs"
        subtitle="Frequently asked questions shown at the bottom of the page"
        onAdd={openNew}
        addLabel="Add FAQ"
      />

      {faqs.map((faq, i) => (
        <Accordion
          key={faq.id}
          sx={{
            mb: 1,
            borderRadius: "8px !important",
            "&:before": { display: "none" },
            boxShadow: 1,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha("#0D47A1", 0.1),
                  color: "primary.main",
                  width: 32,
                  height: 32,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </Avatar>
              <Typography fontWeight={600} sx={{ flex: 1 }}>
                {faq.q || "Untitled question"}
              </Typography>
              <Box
                sx={{ display: "flex", gap: 0.5, mr: 1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => openEdit(faq)}
                    color="primary"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() =>
                      setFaqs((p) => p.filter((f) => f.id !== faq.id))
                    }
                    color="error"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <Typography variant="body2" color="text.secondary">
              {faq.a}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <Dialog
        open={!!editItem}
        onClose={() => setEditItem(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {isNew ? "Add FAQ" : "Edit FAQ"}
          </Typography>
          <IconButton onClick={() => setEditItem(null)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider />
        {editItem && (
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Question"
              value={editItem.q}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, q: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Answer"
              multiline
              rows={4}
              value={editItem.a}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, a: e.target.value }))
              }
            />
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setEditItem(null)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={save}
            variant="contained"
            startIcon={<Save />}
            disabled={!editItem?.q}
          >
            {isNew ? "Add FAQ" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  TAB 5 — Stats
// ════════════════════════════════════════════════════════════════════════════
function StatsTab() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [editItem, setEditItem] = useState(null);

  const openEdit = (s) => setEditItem({ ...s });
  const save = () => {
    setStats((p) => p.map((s) => (s.id === editItem.id ? editItem : s)));
    setEditItem(null);
  };

  return (
    <Box>
      <SectionHeader
        title="Stats Strip"
        subtitle="The four numbers shown just below the hero banner"
      />

      <Grid container spacing={3}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={stat.id}>
            <Card
              sx={{
                textAlign: "center",
                p: 1,
                border: "1px solid",
                borderColor: "divider",
                position: "relative",
              }}
            >
              <CardContent>
                <Typography variant="h3" color="primary" fontWeight={800}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Tooltip title="Edit stat">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => openEdit(stat)}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 4,
          p: 2.5,
          bgcolor: alpha("#0D47A1", 0.04),
          borderRadius: 3,
          border: "1px dashed",
          borderColor: alpha("#0D47A1", 0.2),
        }}
      >
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> Use short, punchy values like <em>15,000+</em>{" "}
          or <em>98%</em>. These are shown inside the white strip card just
          below the hero on the services page.
        </Typography>
      </Box>

      <Dialog
        open={!!editItem}
        onClose={() => setEditItem(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Edit Stat
          </Typography>
          <IconButton onClick={() => setEditItem(null)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider />
        {editItem && (
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Value (e.g. 15,000+ or 98%)"
              value={editItem.value}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, value: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Label (e.g. Happy Clients)"
              value={editItem.label}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, label: e.target.value }))
              }
            />
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setEditItem(null)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={save}
            variant="contained"
            startIcon={<Save />}
            disabled={!editItem?.value}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  ROOT — Admin Shell
// ════════════════════════════════════════════════════════════════════════════
const TABS = [
  { label: "Services", component: ServicesTab },
  { label: "Packages", component: PackagesTab },
  { label: "Process Steps", component: ProcessTab },
  { label: "FAQs", component: FAQsTab },
  { label: "Stats", component: StatsTab },
];

export default function ServicesAdmin() {
  const [tab, setTab] = useState(0);
  const ActiveTab = TABS[tab].component;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        {/* Top nav bar */}
        <Paper
          elevation={2}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "linear-gradient(90deg, #002171 0%, #0D47A1 100%)",
            borderRadius: 0,
          }}
        >
          <Box
            sx={{
              maxWidth: 1280,
              mx: "auto",
              px: 3,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Flight sx={{ color: "#FFB300", fontSize: 24 }} />
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="white"
                sx={{ lineHeight: 1.2 }}
              >
                Services Page Admin
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.6)" }}
              >
                Manage all content shown on the public services page
              </Typography>
            </Box>
            <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
              <Chip
                label="Preview Page ↗"
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={() => window.open("/services", "_blank")}
              />
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ maxWidth: 1280, mx: "auto", px: 3 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                "& .MuiTab-root": {
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  textTransform: "none",
                  letterSpacing: 0.3,
                  minHeight: 44,
                  "&.Mui-selected": { color: "white" },
                },
                "& .MuiTabs-indicator": { bgcolor: "#FFB300", height: 3 },
              }}
            >
              {TABS.map((t) => (
                <Tab key={t.label} label={t.label} disableRipple />
              ))}
            </Tabs>
          </Box>
        </Paper>

        {/* Content */}
        <Box sx={{ maxWidth: 1280, mx: "auto", px: 3, py: 4 }}>
          <ActiveTab />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
