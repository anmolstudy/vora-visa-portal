import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Grid, Card, CardContent, Typography, CircularProgress,
  Alert, Chip, Avatar, List, ListItem, ListItemAvatar,
  ListItemText, Divider, Button, IconButton, Tooltip,
} from "@mui/material";
import {
  People, PersonAdd, Login, Block, TrendingUp, TrendingDown,
  Refresh, AdminPanelSettings, CheckCircle, Warning,
  ManageAccounts, Article,
} from "@mui/icons-material";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { useAdminStats } from "../../hooks/useAdmin.js";
import { useAuth } from "../../context/AuthContext.jsx";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
  <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", height: "100%" }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color }}>
            {value ?? "—"}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {subtitle}
            </Typography>
          )}
          {trend !== undefined && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 0.5 }}>
              {trend >= 0
                ? <TrendingUp sx={{ fontSize: 16, color: "success.main" }} />
                : <TrendingDown sx={{ fontSize: 16, color: "error.main" }} />}
              <Typography variant="caption" sx={{ color: trend >= 0 ? "success.main" : "error.main", fontWeight: 700 }}>
                {trend >= 0 ? "+" : ""}{trend}% vs last month
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar sx={{ bgcolor: color + "20", color, width: 52, height: 52 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { stats, loading, error, refetch } = useAdminStats();

  const chartData = stats?.signupTrend?.map((d) => ({
    name: `${MONTH_NAMES[d.month - 1]} ${d.year}`,
    signups: d.count,
  })) || [];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={56} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0D47A1" }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of users, signups, and system activity
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={refetch} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button variant="outlined" startIcon={<ManageAccounts />} onClick={() => navigate("/admin/users")}>
            Manage Users
          </Button>
          <Button variant="outlined" startIcon={<Article />} onClick={() => navigate("/admin/logs")}>
            View Logs
          </Button>
          <Button variant="contained" color="error" size="small" onClick={logout} sx={{ ml: 1 }}>
            Logout
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.users?.total}
            icon={<People />}
            color="#0D47A1"
            subtitle={`${stats?.users?.active ?? 0} active`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Signups This Month"
            value={stats?.signups?.thisMonth}
            icon={<PersonAdd />}
            color="#2E7D32"
            subtitle={`${stats?.signups?.today ?? 0} today`}
            trend={stats?.signups?.growthRate}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Logins"
            value={stats?.auth?.totalLogins}
            icon={<Login />}
            color="#E65100"
            subtitle={`${stats?.auth?.failedLogins ?? 0} failed attempts`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Suspended Users"
            value={stats?.users?.suspended}
            icon={<Block />}
            color="#C62828"
            subtitle={`${stats?.users?.inactive ?? 0} inactive`}
          />
        </Grid>
      </Grid>

      {/* Chart + Recent Signups */}
      <Grid container spacing={3}>
        {/* Signup Trend Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Signup Trend (Last 6 Months)
            </Typography>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D47A1" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#0D47A1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RTooltip />
                  <Area
                    type="monotone"
                    dataKey="signups"
                    stroke="#0D47A1"
                    strokeWidth={2.5}
                    fill="url(#colorSignups)"
                    dot={{ r: 4, fill: "#0D47A1" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 280 }}>
                <Typography color="text.secondary">No signup data yet</Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Recent Signups */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Recent Signups
              </Typography>
              <List disablePadding>
                {(stats?.recentSignups || []).map((u, idx) => (
                  <Box key={u.id || idx}>
                    <ListItem disableGutters sx={{ py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#0D47A120", color: "#0D47A1", width: 36, height: 36, fontSize: 14 }}>
                          {u.name?.[0]?.toUpperCase() || "U"}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {u.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.3 }}>
                            <Typography variant="caption" color="text.secondary">
                              {u.email}
                            </Typography>
                            <Chip label={u.role} size="small" sx={{ height: 16, fontSize: 10 }} />
                          </Box>
                        }
                      />
                      {u.status === "active"
                        ? <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                        : <Warning sx={{ fontSize: 16, color: "warning.main" }} />}
                    </ListItem>
                    {idx < (stats?.recentSignups?.length - 1) && <Divider />}
                  </Box>
                ))}
                {!stats?.recentSignups?.length && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                    No recent signups
                  </Typography>
                )}
              </List>
              <Button
                fullWidth
                variant="text"
                sx={{ mt: 2 }}
                onClick={() => navigate("/admin/users")}
              >
                View All Users →
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
