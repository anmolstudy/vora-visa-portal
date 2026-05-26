import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Avatar,
  Badge,
  Tooltip,
  Breadcrumbs,
  Link,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HomeIcon from "@mui/icons-material/Home";

import Sidebar from "../components/Sidebar";
import StatCards from "../components/StatCards";
import CandidateTable from "../components/CandidateTable";
import ActivityPanel from "../components/ActivityPanel";
import CashFlowPage from "../components/CashFlowPage";
import AgentsPage from "../components/AgentsPage";
import ExpiryAlerts from "../components/ExpiryAlerts";
import DemandUploadPage from "../components/DemandUploadPage";
import MessagesPage from "../components/MessagesPage";
import Servicess from "../components/Servicess";
import PaymentsPage from "../components/PaymentsPage";
import API from "../services/api";

const DRAWER_WIDTH = 240;

const pageTitles = {
  dashboard: "Dashboard Overview",
  candidates: "All Candidates",
  "demand-upload": "Demand Upload",
  messages: "Contact Messages",
  services: "Visa & Travel Services",
  cashflow: "Cash Flow Register",
  payments: "Payments",
  agents: "Agents",
  alerts: "Expiry & Payment Alerts",
  reports: "Reports & Analytics",
};

function buildInitialAgents(candidates) {
  const seen = new Set();
  return candidates.reduce((acc, c) => {
    const name = c.ref?.trim() || c.name?.trim();
    if (name && name !== "nan" && !seen.has(name.toLowerCase())) {
      seen.add(name.toLowerCase());
      acc.push({
        id: Date.now() + acc.length,
        name,
        phone: "",
        city: "",
        notes: "",
      });
    }
    return acc;
  }, []);
}

// Map visa application fields → candidate table fields
function mapVisaToCandidate(visa) {
  return {
    id: visa._id,
    name: visa.fullName,
    passport: visa.passport || visa.phone || "—",   // FIX: read passport field first
    country: visa.country,
    trade: visa.visaType,
    ref: visa.ref || "",
    ppStatus: visa.ppStatus || "IN MAIL",            // FIX: read real ppStatus from DB
    visa: visa.status,
    payment: visa.payment ?? null,                   // FIX: read real payment from DB
    paymentStatus: visa.paymentStatus || "PENDING",
    ppExp: visa.ppExp ? visa.ppExp.split("T")[0] : null,   // FIX: read real ppExp from DB
    subDate: visa.subDate
      ? visa.subDate.split("T")[0]
      : visa.createdAt
        ? visa.createdAt.split("T")[0]
        : null,
    email: visa.email,
    phone: visa.phone,
    message: visa.message,
    status: visa.status || "NEW",
  };
}

export default function EmployeeDashboard({ adminUser, onLogout }) {
  // Extract admin token from URL query param (?token=...) and persist
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      sessionStorage.setItem("token", urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [globalSearch, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const [candidates, setCandidates] = useState([]);
  const [agents, setAgents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [docChecks, setDocChecks] = useState({});

  // Load visa applications from backend
  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/visa");
      const mapped = (res.data.data || []).map(mapVisaToCandidate);
      setCandidates(mapped);
      setAgents(buildInitialAgents(mapped));
    } catch (err) {
      console.error("Failed to load candidates:", err);
      setToast({
        msg: "⚠️ Could not load candidates from server",
        severity: "warning",
      });
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const stats = useMemo(() => {
    const byCountry = {},
      byStatus = {},
      byTrade = {};
    candidates.forEach((c) => {
      byCountry[c.country] = (byCountry[c.country] || 0) + 1;
      byStatus[c.ppStatus] = (byStatus[c.ppStatus] || 0) + 1;
      if (c.trade && c.trade !== "nan")
        byTrade[c.trade] = (byTrade[c.trade] || 0) + 1;
    });
    return {
      total: candidates.length,
      byCountry,
      byStatus,
      byTrade: Object.fromEntries(
        Object.entries(byTrade)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10),
      ),
      inMail: byStatus["IN MAIL"] || 0,
      inOffice: byStatus["IN OFFICE"] || 0,
    };
  }, [candidates]);

  const cashFlow = useMemo(() => {
    let balance = 0;
    const txWithBalance = transactions.map((t) => {
      balance += (t.cashIn || 0) - (t.cashOut || 0) - (t.smallExp || 0);
      return { ...t, balance };
    });
    return {
      totalIn: transactions.reduce((s, t) => s + (t.cashIn || 0), 0),
      totalOut: transactions.reduce((s, t) => s + (t.cashOut || 0), 0),
      totalExp: transactions.reduce((s, t) => s + (t.smallExp || 0), 0),
      balance,
      transactions: txWithBalance,
    };
  }, [transactions]);

  // Add candidate: POST to /api/admin/visa/apply, then refresh list
  async function handleAddCandidate(c) {
    try {
      const payload = {
        fullName: c.name,
        email: c.email || "noemail@example.com",
        phone: c.passport || "0000000000",
        visaType: c.trade || "Other",
        country: c.country,
        message: c.message || "",
      };
      await API.post("/admin/visa/apply", payload);
      await fetchCandidates(); // refresh from server — no duplicates
      setToast({
        msg: `✅ ${c.name} added successfully!`,
        severity: "success",
      });
    } catch (err) {
      console.error("Add candidate error:", err);
      // Fallback: add locally so UI doesn't feel broken
      setCandidates((prev) => [
        { ...c, id: Date.now(), paymentStatus: "PENDING" },
        ...prev,
      ]);
      setToast({
        msg: `${c.name} added (local only — server unreachable)`,
        severity: "info",
      });
    }
  }

  // Edit: PATCH all fields via /api/admin/visa/:id
  async function handleEditCandidate(updated) {
    try {
      if (updated.id) {
        const payload = {
          fullName: updated.name,
          passport: updated.passport,           // FIX: send as passport, not phone
          phone: updated.phone || updated.passport,
          country: updated.country,
          visaType: updated.trade || "",
          ref: updated.ref || "",
          ppStatus: updated.ppStatus || "IN MAIL",
          status: updated.visa || "NEW",
          payment: updated.payment != null ? Number(updated.payment) : 0,
          paymentStatus: Number(updated.payment) > 0 ? "PAID" : "PENDING",
          ppExp: updated.ppExp || null,
          subDate: updated.subDate || null,
          message: updated.message || "",
        };
        const res = await API.patch(`/admin/visa/${updated.id}`, payload);
        // FIX: use the server response to update local state — not the stale local object
        const saved = mapVisaToCandidate(res.data.data);
        setCandidates((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
      } else {
        setCandidates((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
      }
      setToast({ msg: `✏️ ${updated.name} updated!`, severity: "info" });
    } catch (err) {
      console.error("Edit candidate error:", err);
      // FIX: on error, still update local state optimistically so UI doesn't revert
      setCandidates((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
      setToast({ msg: `⚠️ ${updated.name} saved locally — check connection`, severity: "warning" });
    }
  }

  // Delete: DELETE /api/admin/visa/:id
  async function handleDeleteCandidate(id) {
    const c = candidates.find((x) => x.id === id);
    try {
      if (id) {
        await API.delete(`/admin/visa/${id}`);
      }
      setCandidates((prev) => prev.filter((x) => x.id !== id));
      setToast({
        msg: `🗑 ${c?.name || "Candidate"} removed.`,
        severity: "warning",
      });
    } catch (err) {
      console.error("Delete candidate error:", err);
      setCandidates((prev) => prev.filter((x) => x.id !== id));
      setToast({
        msg: `🗑 ${c?.name || "Candidate"} removed (local only)`,
        severity: "warning",
      });
    }
  }

  function handleAddTransaction(entry) {
    setTransactions((prev) => [{ ...entry, isNew: true }, ...prev]);
    setToast({ msg: "Transaction added!", severity: "success" });
  }

  function handleDocToggle(candidateId, docName) {
    setDocChecks((prev) => {
      const current = prev[candidateId] || [];
      const updated = current.includes(docName)
        ? current.filter((d) => d !== docName)
        : [...current, docName];
      return { ...prev, [candidateId]: updated };
    });
  }

  const expiryCount = candidates.filter((c) => {
    if (!c.ppExp) return false;
    return new Date(c.ppExp) - new Date() < 180 * 24 * 60 * 60 * 1000;
  }).length;

  const filteredCandidates = globalSearch
    ? candidates.filter(
        (c) =>
          c.name?.toLowerCase().includes(globalSearch.toLowerCase()) ||
          c.passport?.toLowerCase().includes(globalSearch.toLowerCase()),
      )
    : candidates;

  const tableProps = {
    onAdd: handleAddCandidate,
    onEdit: handleEditCandidate,
    onDelete: handleDeleteCandidate,
    agents,
    docChecks,
    onDocToggle: handleDocToggle,
  };

  function renderContent() {
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 300,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    switch (activePage) {
      case "dashboard":
        return (
          <>
            <Box mb={3}>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{ color: "#1A1A1A" }}
              >
                Good Day, {adminUser?.name || "Admin"} 👋
              </Typography>
              <Typography variant="body2" color="text.secondary">
                VORA · {candidates.length} candidates · ₹
                {(cashFlow.balance / 100000).toFixed(1)}L balance
              </Typography>
            </Box>
            <Box mb={3}>
              <StatCards stats={stats} cashFlow={cashFlow} />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2.5,
                flexDirection: { xs: "column", lg: "row" },
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <CandidateTable
                  candidates={filteredCandidates}
                  {...tableProps}
                />
              </Box>
              <Box sx={{ width: { xs: "100%", lg: 340 }, flexShrink: 0 }}>
                <ActivityPanel stats={stats} cashFlow={cashFlow} />
              </Box>
            </Box>
          </>
        );
      case "candidates":
        return (
          <>
            <Typography variant="h5" fontWeight={800} mb={3}>
              All Candidates{" "}
              <span style={{ fontWeight: 400, fontSize: 16, color: "#6B7280" }}>
                ({filteredCandidates.length})
              </span>
            </Typography>
            <CandidateTable candidates={filteredCandidates} {...tableProps} />
          </>
        );
      case "services":
        return (
          <>
            <Typography variant="h5" fontWeight={800} mb={3}>
              Service Management
            </Typography>
            <Servicess />
          </>
        );
      case "cashflow":
        return (
          <>
            <Typography variant="h5" fontWeight={800} mb={3}>
              Cash Flow Register
            </Typography>
            <CashFlowPage
              cashFlow={cashFlow}
              onAddTransaction={handleAddTransaction}
              candidates={candidates}
              agents={agents}
            />
          </>
        );
      case "payments":
        return <PaymentsPage />;
      case "agents":
        return (
          <>
            <Typography variant="h5" fontWeight={800} mb={3}>
              Agents{" "}
              <span style={{ fontWeight: 400, fontSize: 16, color: "#6B7280" }}>
                ({agents.length} registered)
              </span>
            </Typography>
            <AgentsPage
              agents={agents}
              onAgentsChange={setAgents}
              candidates={candidates}
            />
          </>
        );
      case "alerts":
        return (
          <>
            <Typography variant="h5" fontWeight={800} mb={3}>
              Expiry & Payment Alerts
              {expiryCount > 0 && (
                <span
                  style={{
                    marginLeft: 12,
                    fontSize: 14,
                    color: "#F59E0B",
                    fontWeight: 600,
                  }}
                >
                  {expiryCount} passports expiring soon
                </span>
              )}
            </Typography>
            <ExpiryAlerts candidates={candidates} />
          </>
        );
      case "reports":
        return (
          <>
            <Typography variant="h5" fontWeight={800} mb={3}>
              Reports & Analytics
            </Typography>
            <Box mb={3}>
              <StatCards stats={stats} cashFlow={cashFlow} />
            </Box>
            <ActivityPanel stats={stats} cashFlow={cashFlow} />
          </>
        );
      case "demand-upload":
        return (
          <>
            <Typography variant="h5" fontWeight={800} mb={3}>
              Current Demand Upload
            </Typography>
            <DemandUploadPage />
          </>
        );
      case "messages":
        return <MessagesPage />;
      default:
        return <Typography color="text.secondary">Coming soon…</Typography>;
    }
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F5F7FB" }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage}
        onNavigate={setActivePage}
        stats={stats}
        expiryCount={expiryCount}
      />

      <Box
        component="main"
        sx={{ flexGrow: 1, transition: "margin 0.3s ease", minWidth: 0 }}
      >
        {/* Navbar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "#fff",
            borderBottom: "1px solid #E5E7EB",
            zIndex: 100,
          }}
        >
          <Toolbar sx={{ gap: 2, px: { xs: 2, sm: 3 } }}>
            <IconButton
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{
                color: "#3F51B5",
                bgcolor: "rgba(63,81,181,0.06)",
                borderRadius: 2,
                "&:hover": { bgcolor: "rgba(63,81,181,0.12)" },
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                color: "#1A1A1A",
                flexGrow: 0,
                mr: 1,
                display: { xs: "none", sm: "block" },
                fontSize: 15,
              }}
            >
              {pageTitles[activePage] || "Dashboard"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#F5F7FB",
                borderRadius: 2.5,
                px: 1.5,
                py: 0.5,
                flexGrow: 1,
                maxWidth: 380,
                border: "1.5px solid #E5E7EB",
                transition: "all 0.2s",
                "&:focus-within": {
                  borderColor: "#3F51B5",
                  boxShadow: "0 0 0 3px rgba(63,81,181,0.10)",
                  bgcolor: "#fff",
                },
              }}
            >
              <SearchIcon sx={{ color: "#9CA3AF", mr: 1, fontSize: 19 }} />
              <InputBase
                placeholder="Search candidate or passport..."
                value={globalSearch}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  fontSize: 13.5,
                  width: "100%",
                  fontFamily: '"Poppins", sans-serif',
                }}
              />
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Tooltip title={`${expiryCount} passport expiry alerts`}>
              <IconButton
                onClick={() => setActivePage("alerts")}
                sx={{
                  color: "#6B7280",
                  "&:hover": {
                    bgcolor: "rgba(245,158,11,0.08)",
                    color: "#F59E0B",
                  },
                }}
              >
                <Badge badgeContent={expiryCount} color="warning">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip
              title={`Logged in as ${adminUser?.name || "Admin"} · Click to logout`}
            >
              <Avatar
                onClick={onLogout}
                sx={{
                  background:
                    "linear-gradient(135deg, #3F51B5 0%, #5C6BC0 100%)",
                  width: 36,
                  height: 36,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(63,81,181,0.3)",
                  "&:hover": { opacity: 0.85 },
                }}
              >
                {adminUser?.name?.charAt(0)?.toUpperCase() || "A"}
              </Avatar>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* Body */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Breadcrumbs sx={{ mb: 2.5, fontSize: 13 }}>
            <Link
              underline="hover"
              onClick={() => setActivePage("dashboard")}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#6B7280",
                fontFamily: '"Poppins", sans-serif',
                fontSize: 13,
                "&:hover": { color: "#3F51B5" },
              }}
            >
              <HomeIcon sx={{ fontSize: 15 }} /> Home
            </Link>
            <Typography
              fontSize={13}
              color="#1A1A1A"
              fontWeight={600}
              sx={{ fontFamily: '"Poppins", sans-serif' }}
            >
              {pageTitles[activePage] || "Dashboard"}
            </Typography>
          </Breadcrumbs>
          {renderContent()}
        </Box>
      </Box>

      <Snackbar
        open={!!toast}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast?.severity || "success"}
          onClose={() => setToast(null)}
          sx={{ borderRadius: 2 }}
        >
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}