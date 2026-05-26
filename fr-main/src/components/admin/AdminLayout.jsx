import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, Divider,
  AppBar, Toolbar, IconButton, Avatar, Chip, useMediaQuery,
} from "@mui/material";
import {
  Dashboard, People, Article, Menu as MenuIcon,
  AdminPanelSettings, Logout,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext.jsx";

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Dashboard", icon: <Dashboard />, path: "/admin" },
  { label: "Users",     icon: <People />,    path: "/admin/users" },
  { label: "Auth Logs", icon: <Article />,   path: "/admin/logs" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <AdminPanelSettings sx={{ color: "#0D47A1", fontSize: 30 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0D47A1", lineHeight: 1 }}>
            Admin Panel
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Visa Travel System
          </Typography>
        </Box>
      </Box>
      <Divider />

      {/* Nav Items */}
      <List sx={{ px: 1, py: 2, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? "#0D47A115" : "transparent",
                  color: active ? "#0D47A1" : "text.primary",
                  "&:hover": { bgcolor: "#0D47A110" },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: "0.9rem" }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User Info & Logout */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5, p: 1.5, borderRadius: 2, bgcolor: "#F5F7FA" }}>
          <Avatar sx={{ bgcolor: "#0D47A1", width: 36, height: 36, fontSize: 14 }}>
            {user?.name?.[0]?.toUpperCase() || "A"}
          </Avatar>
          <Box sx={{ overflow: "hidden" }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{user?.name}</Typography>
            <Chip label={user?.role} size="small" color="primary" sx={{ height: 16, fontSize: 10 }} />
          </Box>
        </Box>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: "error.main", "&:hover": { bgcolor: "error.50" } }}>
          <ListItemIcon sx={{ color: "error.main", minWidth: 36 }}><Logout /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar position="fixed" sx={{ bgcolor: "#fff", color: "text.primary", boxShadow: 1 }}>
          <Toolbar>
            <IconButton onClick={() => setMobileOpen(true)} edge="start" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0D47A1" }}>
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {/* Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}
        >
          {drawer}
        </Drawer>
        {/* Desktop */}
        <Drawer
          variant="permanent"
          sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box", borderRight: "1px solid #E8ECEF" } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#F8FAFC",
          minHeight: "100vh",
          mt: { xs: 8, md: 0 },
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
