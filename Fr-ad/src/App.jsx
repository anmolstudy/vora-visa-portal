import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminLogin from "./components/AdminLogin";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
      light: "#2a7a2d",
      dark: "#013f03",
      contrastText: "#fff",
    },
    secondary: {
      main: "#285A48",
      light: "#408A71",
      dark: "#1F4638",
      contrastText: "#fff",
    },
    info: { main: "#408A71" },
    success: { main: "#285A48" },
    warning: { main: "#FF85BB" },
    error: { main: "#EF4444" },
    background: { default: "#F5F5F5", paper: "#FFFFFF" },
    text: { primary: "#091413", secondary: "#5F6F6B" },
  },
  typography: {
    fontFamily: '"Poppins", "Segoe UI", sans-serif',
    h1: { fontSize: "2rem", fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.25 },
    h3: { fontSize: "1.375rem", fontWeight: 600, lineHeight: 1.3 },
    h4: { fontSize: "1.125rem", fontWeight: 600 },
    h5: { fontSize: "1rem", fontWeight: 700 },
    h6: { fontSize: "0.9rem", fontWeight: 700 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", lineHeight: 1.55 },
    caption: { fontSize: "0.75rem" },
    button: { fontFamily: '"Poppins", sans-serif', fontWeight: 600, textTransform: "none", letterSpacing: 0.3 },
    overline: { fontFamily: '"Poppins", sans-serif', fontWeight: 700, fontSize: "0.7rem", letterSpacing: 1.2 },
    subtitle1: { fontWeight: 600, fontSize: "0.9rem" },
    subtitle2: { fontWeight: 600, fontSize: "0.8rem" },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, fontFamily: '"Poppins", sans-serif', fontWeight: 600,
          fontSize: "0.875rem", padding: "8px 20px", transition: "all 0.2s ease",
          boxShadow: "none", textTransform: "none",
          "&:hover": { boxShadow: "0 4px 12px rgba(63, 181, 106, 0.25)", transform: "translateY(-1px)" },
          "&:active": { transform: "translateY(0)" },
        },
        containedPrimary: {
          background: "linear-gradient(135deg,  #285A48 100%)",
          "&:hover": { background: "linear-gradient(135deg,  #1F4638 100%)", boxShadow: "0 4px 14px rgba(2, 84, 54, 0.35)" },
        },
        containedError: { background: "#FF85BB", "&:hover": { background: "#e96aa6" } },
        containedSecondary: {
          background: "linear-gradient(135deg, #285A48 0%, #408A71 100%)",
          "&:hover": { background: "linear-gradient(135deg, #1F4638 0%, #285A48 100%)" },
        },
        outlined: {
          borderColor: "#D1D5DB",
          "&:hover": { borderColor: "#285A48", color: "#285A48", background: "rgba(63, 181, 134, 0.04)", boxShadow: "none", transform: "none" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12, backgroundColor: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s ease, transform 0.2s ease" },
      },
    },
    MuiCardContent: { styleOverrides: { root: { padding: "20px", "&:last-child": { paddingBottom: "20px" } } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8, fontFamily: '"Poppins", sans-serif', fontSize: "0.875rem",
            backgroundColor: "#FAFAFA", transition: "box-shadow 0.15s",
            "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(40,90,72,0.15)" },
            "&.Mui-focused fieldset": { borderColor: "#285A48" },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8, fontFamily: '"Poppins", sans-serif',
          "& fieldset": { borderColor: "#E5E7EB" },
          "&:hover fieldset": { borderColor: "#285A48" },
          "&.Mui-focused fieldset": { borderColor: "#285A48", borderWidth: 2 },
          "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(63,81,181,0.10)" },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontFamily: '"Poppins", sans-serif', fontSize: "0.875rem", "&.Mui-focused": { color: "#285A48" } } },
    },
    MuiSelect: { styleOverrides: { root: { borderRadius: 8, fontFamily: '"Poppins", sans-serif', fontSize: "0.875rem" } } },
    MuiTableCell: {
      styleOverrides: {
        root: { fontFamily: '"Poppins", sans-serif', fontSize: "0.8125rem", borderBottom: "1px solid #F3F4F6" },
        head: { fontFamily: '"Poppins", sans-serif', fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#6B7280", backgroundColor: "#F9FAFB", borderBottom: "2px solid #E5E7EB" },
      },
    },
    MuiTableRow: { styleOverrides: { root: { transition: "background-color 0.15s", "&:hover": { backgroundColor: "#F0FAF6" } } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" } } },
    MuiDialogTitle: { styleOverrides: { root: { fontFamily: '"Poppins", sans-serif', fontWeight: 700, fontSize: "1rem", padding: "20px 24px 12px" } } },
    MuiDialogContent: { styleOverrides: { root: { padding: "16px 24px" } } },
    MuiDialogActions: { styleOverrides: { root: { padding: "12px 24px 20px", gap: 8 } } },
    MuiAppBar: { styleOverrides: { root: { boxShadow: "0 1px 0 #E5E7EB" } } },
    MuiToolbar: { styleOverrides: { root: { minHeight: 60, "@media (min-width: 600px)": { minHeight: 60 } } } },
    MuiListItemButton: { styleOverrides: { root: { borderRadius: 8, transition: "all 0.15s ease", fontFamily: '"Poppins", sans-serif' } } },
    MuiAlert: { styleOverrides: { root: { borderRadius: 8, fontFamily: '"Poppins", sans-serif', fontSize: "0.875rem" } } },
    MuiTooltip: { styleOverrides: { tooltip: { fontFamily: '"Poppins", sans-serif', fontSize: "0.75rem", borderRadius: 6, backgroundColor: "#1A1A1A" } } },
    MuiAvatar: { styleOverrides: { root: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 } } },
    MuiLinearProgress: { styleOverrides: { root: { borderRadius: 4 }, bar: { borderRadius: 4 } } },
    MuiTablePagination: { styleOverrides: { root: { fontFamily: '"Poppins", sans-serif', fontSize: "0.8rem" }, selectLabel: { fontFamily: '"Poppins", sans-serif' }, displayedRows: { fontFamily: '"Poppins", sans-serif' } } },
    MuiDivider: { styleOverrides: { root: { borderColor: "#F3F4F6" } } },
  },
});

export default function App() {
  // Check if admin is already logged in
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem("adminUser");
      const token = sessionStorage.getItem("token");
      if (stored && token) return JSON.parse(stored);
    } catch {}
    return null;
  });

  function handleLogin(user) {
    setAdminUser(user);
  }

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("adminUser");
    setAdminUser(null);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; background: #F5F7FB; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #F3F4F6; border-radius: 3px; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
      `}</style>
      <BrowserRouter>
        <Routes>
          {!adminUser ? (
            <>
              <Route path="/login" element={<AdminLogin onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<EmployeeDashboard adminUser={adminUser} onLogout={handleLogout} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
