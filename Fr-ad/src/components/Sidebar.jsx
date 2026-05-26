import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  Chip,
  Badge,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentsIcon from "@mui/icons-material/Payments";
import GroupIcon from "@mui/icons-material/Group";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FlagIcon from "@mui/icons-material/Flag";
import PublicIcon from "@mui/icons-material/Public";
import BadgeIcon from "@mui/icons-material/Badge";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EmailIcon from "@mui/icons-material/Email";

const DRAWER_WIDTH = 240;

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon />, key: "dashboard" },
  { label: "All Candidates", icon: <PeopleIcon />, key: "candidates" },
  { label: "Demand Upload", icon: <CloudUploadIcon />, key: "demand-upload" },
  { label: "Services", icon: <BadgeIcon />, key: "services" },

  { label: "Messages", icon: <EmailIcon />, key: "messages" },
  // { label: "By Country",    icon: <PublicIcon />,               key: "bycountry" },
  // { label: "Cash Flow", icon: <AccountBalanceWalletIcon />, key: "cashflow" },
  { label: "Payments", icon: <PaymentsIcon />, key: "payments" },
  // { label: "Staff Salary", icon: <BadgeIcon />, key: "salary" },
  // { label: "Agents", icon: <GroupIcon />, key: "agents" },
  {
    label: "Expiry Alerts",
    icon: <WarningAmberIcon />,
    key: "alerts",
    alertKey: true,
  },
  { label: "Reports", icon: <BarChartIcon />, key: "reports" },
];

export default function Sidebar({
  open,
  onClose,
  activePage,
  onNavigate,
  stats,
  expiryCount,
}) {
  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          background:
            "linear-gradient(180deg, #1a237e 0%, #283593 45%, #3F51B5 100%)",
          color: "#fff",
          borderRight: "none",
          overflowX: "hidden",
        },
      }}
    >
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box
            sx={{
              bgcolor: "rgba(0,172,193,0.25)",
              borderRadius: 2,
              p: 0.7,
              display: "flex",
            }}
          >
            <FlagIcon sx={{ color: "#4DD0E1", fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ color: "#fff", lineHeight: 1.1, fontSize: 14 }}
            >
              VORA
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#90CAF9", fontSize: 11 }}
            >
              Employee CRM
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "#90CAF9",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          mx: 2,
          mb: 1.5,
          p: 1.5,
          borderRadius: 2,
          bgcolor: "rgba(0,172,193,0.15)",
          border: "1px solid rgba(0,172,193,0.3)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#90CAF9",
            display: "block",
            fontWeight: 500,
            fontSize: 11,
          }}
        >
          Total Candidates
        </Typography>
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{ color: "#4DD0E1", lineHeight: 1.2 }}
        >
          {stats?.total || 0}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 0.5 }} />

      <List dense sx={{ px: 1 }}>
        {menuItems.map((item) => {
          const isActive = activePage === item.key;
          const showBadge = item.alertKey && expiryCount > 0;
          return (
            <ListItem key={item.key} disablePadding sx={{ mb: 0.3 }}>
              <ListItemButton
                onClick={() => onNavigate(item.key)}
                sx={{
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.9,
                  bgcolor: isActive ? "rgba(0,172,193,0.22)" : "transparent",
                  borderLeft: isActive
                    ? "3px solid #00ACC1"
                    : "3px solid transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.09)" },
                  transition: "all 0.15s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive
                      ? "#4DD0E1"
                      : item.alertKey
                        ? "#F59E0B"
                        : "#90CAF9",
                    minWidth: 34,
                  }}
                >
                  {showBadge ? (
                    <Badge
                      badgeContent={expiryCount}
                      color="warning"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: 9,
                          minWidth: 16,
                          height: 16,
                        },
                      }}
                    >
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? "#fff" : "#CBD5E1",
                    fontFamily: '"Poppins", sans-serif',
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#00ACC1",
                      flexShrink: 0,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mt: 1, mb: 1 }} />
      {/* <Box sx={{ px: 2, pb: 3 }}>
        <Typography
          variant="caption"
          sx={{
            color: "#90CAF9",
            textTransform: "uppercase",
            letterSpacing: 1,
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          By Country
        </Typography>
        {stats &&
          Object.entries(stats.byCountry || {}).map(([country, count]) => (
            <Box
              key={country}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 0.8,
                alignItems: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#CBD5E1", fontSize: 12 }}
              >
                {country}
              </Typography>
              <Chip
                label={count}
                size="small"
                sx={{
                  bgcolor: "rgba(0,172,193,0.2)",
                  color: "#4DD0E1",
                  fontSize: 10,
                  height: 18,
                  fontWeight: 700,
                  border: "1px solid rgba(0,172,193,0.3)",
                }}
              />
            </Box>
          ))}
      </Box> */}
    </Drawer>
  );
}
