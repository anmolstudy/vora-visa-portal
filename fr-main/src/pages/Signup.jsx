import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card as MuiCard,
  Chip,
  CircularProgress,
  CssBaseline,
  Divider,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { styled, ThemeProvider, alpha } from "@mui/material/styles";
import {
  AdminPanelSettings,
  Badge,
  Email,
  HowToReg,
  Lock,
  Person,
  PersonAdd,
  Work,
} from "@mui/icons-material";
// AppAppBar is handled by MainLayout
import { authTheme, submitButtonSx } from "./authTheme";
import DecorativeRings from "./DecorativeRings";

// ── Styled layout wrappers ───────────────────────────────────────────────────

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: theme.spacing(5),
  gap: theme.spacing(2),
  margin: "auto",
  borderRadius: 20,
  border: `1px solid ${alpha("#0D47A1", 0.12)}`,
  boxShadow: "0 24px 64px rgba(13,71,161,0.13)",
  [theme.breakpoints.up("sm")]: { width: "480px" },
}));

const PageWrapper = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: "120px",
  paddingBottom: "60px",
  gap: theme.spacing(2),
  background: "linear-gradient(135deg, #002171 0%, #0D47A1 55%, #1565C0 100%)",
  position: "relative",
  overflow: "hidden",
}));

const labelSx = {
  fontFamily: "'Lato', sans-serif",
  fontWeight: 700,
  color: "text.primary",
  mb: 0.8,
  fontSize: "0.9rem",
};

// Icon shown next to each role option in the dropdown
const ROLE_ICONS = {
  user: <Person sx={{ fontSize: 18, color: "#0D47A1" }} />,
  employee: <Work sx={{ fontSize: 18, color: "#0D47A1" }} />,
  admin: <AdminPanelSettings sx={{ fontSize: 18, color: "#0D47A1" }} />,
};

// ── Component ────────────────────────────────────────────────────────────────

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    if (password.length < 6) errs.password = "Minimum 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      navigate("/login");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={authTheme}>
      <CssBaseline />
      <PageWrapper>
        <DecorativeRings />

        <Card variant="outlined">
          {/* ── Card header ── */}
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
                borderRadius: "50%",
                width: 60,
                height: 60,
                mb: 1.5,
                boxShadow: "0 8px 24px rgba(13,71,161,0.35)",
              }}
            >
              <PersonAdd sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Chip
              label="CREATE ACCOUNT"
              size="small"
              sx={{
                display: "block",
                mx: "auto",
                mb: 0.5,
                bgcolor: alpha("#0D47A1", 0.08),
                color: "primary.main",
                letterSpacing: 2,
                fontSize: "0.65rem",
                fontFamily: "'Lato', sans-serif",
                fontWeight: 700,
              }}
            />
            <Typography variant="h4" color="primary">
              Sign Up
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              Join us for seamless visa &amp; travel services
            </Typography>
          </Box>

          <Divider sx={{ borderColor: alpha("#0D47A1", 0.08) }} />

          {apiError && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {apiError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Full name */}
            <FormControl fullWidth sx={{ mb: 2.5 }}>
              <FormLabel sx={labelSx}>Full Name</FormLabel>
              <TextField
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge
                        sx={{ color: alpha("#0D47A1", 0.4), fontSize: 18 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {/* Email */}
            <FormControl fullWidth sx={{ mb: 2.5 }}>
              <FormLabel sx={labelSx}>Email Address</FormLabel>
              <TextField
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email
                        sx={{ color: alpha("#0D47A1", 0.4), fontSize: 18 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {/* Password */}
            <FormControl fullWidth sx={{ mb: 2.5 }}>
              <FormLabel sx={labelSx}>Password</FormLabel>
              <TextField
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock
                        sx={{ color: alpha("#0D47A1", 0.4), fontSize: 18 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {/* Role — controls what dashboard the user sees after login */}
            {/* <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel sx={labelSx}>Role</FormLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                renderValue={(val) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {ROLE_ICONS[val]}
                    <Typography
                      sx={{
                        fontFamily: "'Lato', sans-serif",
                        textTransform: "capitalize",
                      }}
                    >
                      {val}
                    </Typography>
                  </Box>
                )}
              >
                {Object.keys(ROLE_ICONS).map((r) => (
                  <MenuItem key={r} value={r}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      {ROLE_ICONS[r]}
                      <Typography
                        sx={{
                          fontFamily: "'Lato', sans-serif",
                          textTransform: "capitalize",
                        }}
                      >
                        {r}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={!loading && <HowToReg />}
              sx={submitButtonSx}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "white" }} />
              ) : (
                "Create Account"
              )}
            </Button>
          </Box>

          <Divider sx={{ borderColor: alpha("#0D47A1", 0.08) }}>
            <Typography variant="caption" color="text.disabled" sx={{ px: 1 }}>
              ALREADY A MEMBER?
            </Typography>
          </Divider>

          <Typography textAlign="center" variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#0D47A1",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign In →
            </Link>
          </Typography>
        </Card>

        <Typography
          variant="caption"
          sx={{ color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}
        >
          © {new Date().getFullYear()} Visa & Travel Services · Secure
          Registration
        </Typography>
      </PageWrapper>
    </ThemeProvider>
  );
}
