import { useState } from "react";
import {
  AppBar, Box, Button, Container, Drawer,
  IconButton, MenuItem, Toolbar, Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

const ORANGE = "#F97316";

const NAV_LINKS = [
  { label: "Home", path: "/home" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
  { label: "FAQ", path: "/faq" },
];

export default function AppAppBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (e, path) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    navigate("/login");
    setDrawerOpen(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/home");
  };

  return (
    <AppBar position="fixed" elevation={0}
      sx={{
        background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        color: "#222",
      }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", py: 0.5 }}>

          {/* Logo */}
          <Box
            onClick={handleLogoClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                bgcolor: ORANGE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FlightTakeoffIcon sx={{ color: "white", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
                VORA
              </Typography>
              <Typography variant="caption" sx={{ color: ORANGE, letterSpacing: 1, fontSize: "0.6rem" }}>
                VISA & TRAVEL
              </Typography>
            </Box>
          </Box>

          {/* Desktop nav links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, alignItems: "center" }}>
            {NAV_LINKS.map(({ label, path }) => (
              <Button
                key={label}
                onClick={(e) => handleNavClick(e, path)}
                sx={{
                  textTransform: "none",
                  fontWeight: isActive(path) ? 700 : 500,
                  color: isActive(path) ? ORANGE : "#444",
                  borderBottom: isActive(path) ? `2px solid ${ORANGE}` : "2px solid transparent",
                  borderRadius: 0,
                  px: 2,
                  "&:hover": { color: ORANGE, background: "transparent" }
                }}>
                {label}
              </Button>
            ))}
            {user?.role === "admin" && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `${import.meta.env.VITE_ADMIN_URL || "http://localhost:5174"}/dashboard`;
                }}
                sx={{ textTransform: "none", fontWeight: 700, color: ORANGE }}>
                Admin Panel
              </Button>
            )}
          </Box>

          {/* Desktop auth buttons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {user ? (
              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  textTransform: "none",
                  borderColor: "#ddd",
                  color: "#444",
                  "&:hover": { borderColor: ORANGE, color: ORANGE }
                }}>
                Logout
              </Button>
            ) : (
              <>
                <Button
                  onClick={(e) => handleNavClick(e, "/login")}
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderColor: "#ddd",
                    color: "#444",
                    "&:hover": { borderColor: ORANGE, color: ORANGE }
                  }}>
                  Log In
                </Button>
                <Button
                  onClick={(e) => handleNavClick(e, "/signup")}
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    background: ORANGE,
                    "&:hover": { background: "#EA580C" },
                    boxShadow: "none"
                  }}>
                  Sign Up Free
                </Button>
              </>
            )}
          </Box>

          {/* Mobile hamburger */}
          <IconButton
            sx={{ display: { md: "none" } }}
            onClick={(e) => { e.preventDefault(); setDrawerOpen(true); }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 260 } }}
      >
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography fontWeight={700} color="#0D47A1">Menu</Typography>
            <IconButton size="small" onClick={() => setDrawerOpen(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          {NAV_LINKS.map(({ label, path }) => (
            <MenuItem
              key={label}
              onClick={(e) => handleNavClick(e, path)}
              sx={{
                borderRadius: 2,
                fontWeight: isActive(path) ? 700 : 400,
                color: isActive(path) ? ORANGE : "#333",
                mb: 0.5
              }}>
              {label}
            </MenuItem>
          ))}

          {user?.role === "admin" && (
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `${import.meta.env.VITE_ADMIN_URL || "http://localhost:5174"}/dashboard`;
                setDrawerOpen(false);
              }}
              sx={{ borderRadius: 2, color: ORANGE, fontWeight: 700 }}>
              Admin Panel
            </MenuItem>
          )}

          {user ? (
            <Button
              variant="outlined"
              fullWidth
              onClick={handleLogout}
              sx={{ mt: 3, textTransform: "none", borderColor: "#ddd", color: "#444" }}>
              Logout
            </Button>
          ) : (
            <>
              <Button
                onClick={(e) => handleNavClick(e, "/signup")}
                variant="contained"
                fullWidth
                sx={{ mt: 3, background: ORANGE, textTransform: "none" }}>
                Sign Up Free
              </Button>
              <Button
                onClick={(e) => handleNavClick(e, "/login")}
                variant="outlined"
                fullWidth
                sx={{ mt: 1, textTransform: "none", borderColor: "#ddd" }}>
                Log In
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
