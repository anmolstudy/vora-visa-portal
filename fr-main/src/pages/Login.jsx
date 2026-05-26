import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Alert, Box, Button, Card as MuiCard, Chip, CircularProgress,
  CssBaseline, Divider, FormControl, FormLabel, IconButton,
  InputAdornment, Stack, TextField, Typography,
} from "@mui/material";
import { styled, ThemeProvider, alpha } from "@mui/material/styles";
import { Flight, Login as LoginIcon, LockReset, Visibility, VisibilityOff } from "@mui/icons-material";
import { authTheme, submitButtonSx } from "./authTheme";
import DecorativeRings from "./DecorativeRings";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const ADMIN_PANEL_URL = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex", flexDirection: "column", width: "100%",
  padding: theme.spacing(5), gap: theme.spacing(2), margin: "auto",
  borderRadius: 20, border: `1px solid ${alpha("#0D47A1", 0.12)}`,
  boxShadow: "0 24px 64px rgba(13,71,161,0.13)",
  [theme.breakpoints.up("sm")]: { width: "460px" },
}));

const PageWrapper = styled(Stack)(() => ({
  minHeight: "100vh", alignItems: "center", justifyContent: "center",
  background: "linear-gradient(135deg, #002171 0%, #0D47A1 55%, #1565C0 100%)",
  position: "relative", overflow: "hidden",
}));

const labelSx = {
  fontFamily: "'Lato', sans-serif", fontWeight: 700,
  color: "text.primary", mb: 0.8, fontSize: "0.9rem",
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { token } = useParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (token) { setShowReset(true); setResetToken(token); }
  }, [token]);

  const validate = () => {
    const errs = {};
    if (!showReset) {
      if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
      if (password.length < 8) errs.password = "Minimum 8 characters";
    } else {
      if (newPassword.length < 8) errs.newPassword = "Minimum 8 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Store token in sessionStorage (via AuthContext)
      login(data.token, data.user);

      if (data.user.role === "admin") {
        // DO NOT pass token in the URL — it ends up in server logs and history.
        // The admin panel should read the token from sessionStorage directly.
        window.location.href = `${ADMIN_PANEL_URL}/dashboard`;
      } else {
        const fromState = location.state;
        if (fromState?.openPayment) {
          navigate(fromState.from || "/home", { state: { openPayment: true } });
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!/\S+@\S+\.\S+/.test(email)) { setErrors({ email: "Enter a valid email to reset" }); return; }
    setApiError(""); setForgotLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not send reset link");
      setForgotSuccess("If that email is registered, a reset link has been sent.");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validate()) return;
    setApiError(""); setResetLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setResetSuccess("Password reset! You can now sign in.");
      setShowReset(false); setResetToken(""); setNewPassword("");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  const passwordToggle = (
    <InputAdornment position="end">
      <IconButton size="small" onClick={() => setShowPwd(!showPwd)} aria-label="toggle password visibility">
        {showPwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <ThemeProvider theme={authTheme}>
      <CssBaseline />
      <PageWrapper>
        <DecorativeRings />
        <Card variant="outlined">
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
              bgcolor: "primary.main", borderRadius: "50%", width: 60, height: 60,
              mb: 1.5, boxShadow: "0 8px 24px rgba(13,71,161,0.35)" }}>
              {showReset ? <LockReset sx={{ color: "white", fontSize: 28 }} /> : <Flight sx={{ color: "white", fontSize: 28 }} />}
            </Box>
            <Chip label={showReset ? "SECURITY" : "WELCOME BACK"} size="small"
              sx={{ display: "block", mx: "auto", mb: 0.5, bgcolor: alpha("#0D47A1", 0.08),
                color: "primary.main", letterSpacing: 2, fontSize: "0.65rem",
                fontFamily: "'Lato', sans-serif", fontWeight: 700 }} />
            <Typography variant="h4" color="primary">{showReset ? "Reset Password" : "Sign In"}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              {showReset ? "Create a new secure password" : "Access your visa & travel dashboard"}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: alpha("#0D47A1", 0.08) }} />

          {apiError && <Alert severity="error" sx={{ borderRadius: 2 }}>{apiError}</Alert>}
          {forgotSuccess && <Alert severity="success" sx={{ borderRadius: 2 }}>{forgotSuccess}</Alert>}
          {resetSuccess && <Alert severity="success" sx={{ borderRadius: 2 }}>{resetSuccess}</Alert>}

          {!showReset && (
            <Box component="form" onSubmit={handleLogin} noValidate>
              <FormControl fullWidth sx={{ mb: 2.5 }}>
                <FormLabel sx={labelSx}>Email Address</FormLabel>
                <TextField
                  placeholder="you@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email} helperText={errors.email}
                  inputProps={{ autoComplete: "email" }}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <FormLabel sx={labelSx}>Password</FormLabel>
                <TextField type={showPwd ? "text" : "password"} placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password} helperText={errors.password}
                  InputProps={{ endAdornment: passwordToggle }}
                  inputProps={{ autoComplete: "current-password" }}
                />
              </FormControl>
              <Box sx={{ textAlign: "right", mb: 3 }}>
                <Typography variant="body2" onClick={handleForgotPassword}
                  sx={{ cursor: "pointer", color: "primary.main", display: "inline",
                    fontFamily: "'Lato', sans-serif", fontWeight: 600,
                    "&:hover": { color: "secondary.main", textDecoration: "underline" } }}>
                  {forgotLoading ? "Sending reset link…" : "Forgot password?"}
                </Typography>
              </Box>
              <Button type="submit" variant="contained" fullWidth size="large"
                disabled={loading} startIcon={!loading && <LoginIcon />} sx={submitButtonSx}>
                {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Sign In"}
              </Button>
            </Box>
          )}

          {showReset && (
            <Box>
              <FormControl fullWidth sx={{ mb: 2.5 }}>
                <FormLabel sx={labelSx}>Reset Token</FormLabel>
                <TextField placeholder="Paste the token from your email" value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)} />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel sx={labelSx}>New Password</FormLabel>
                <TextField type={showPwd ? "text" : "password"} placeholder="Minimum 8 characters"
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  error={!!errors.newPassword} helperText={errors.newPassword}
                  InputProps={{ endAdornment: passwordToggle }} />
              </FormControl>
              <Button onClick={handleResetPassword} variant="contained" fullWidth size="large"
                disabled={resetLoading} startIcon={!resetLoading && <LockReset />} sx={submitButtonSx}>
                {resetLoading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Reset Password"}
              </Button>
              <Button fullWidth variant="text" color="primary"
                sx={{ mt: 1.5, textTransform: "none", letterSpacing: 0 }}
                onClick={() => { setShowReset(false); setResetToken(""); setNewPassword(""); }}>
                ← Back to Login
              </Button>
            </Box>
          )}

          {!showReset && (
            <>
              <Divider sx={{ borderColor: alpha("#0D47A1", 0.08) }}>
                <Typography variant="caption" color="text.disabled" sx={{ px: 1 }}>NEW HERE?</Typography>
              </Divider>
              <Typography textAlign="center" variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link to="/signup" style={{ color: "#0D47A1", fontWeight: 700, textDecoration: "none" }}>
                  Create Account →
                </Link>
              </Typography>
            </>
          )}
        </Card>
        <Typography variant="caption" sx={{ mt: 3, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>
          © {new Date().getFullYear()} Visa &amp; Travel Services · Secure Login
        </Typography>
      </PageWrapper>
    </ThemeProvider>
  );
}
