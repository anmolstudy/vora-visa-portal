import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  AccessTime,
  ArrowForward,
  CheckCircle,
  Download,
  Email,
  EmojiEvents,
  ExpandMore,
  Flight,
  LocationOn,
  Phone,
  Public,
  Security,
  Speed,
  SupportAgent,
  ThumbUp,
  WhatsApp,
  CreditCard,
} from "@mui/icons-material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import {
  SERVICES,
  CATEGORIES,
  PROCESS_STEPS,
  PACKAGES,
  STATS,
  FAQS,
} from "./servicesData";
import PaymentModal from "../../components/PaymentModal";

// ── Theme ────────────────────────────────────────────────────────────────────

const theme = createTheme({
  palette: {
    primary: { main: "#F97316", light: "#FB923C", dark: "#EA580C" },
    secondary: { main: "#0F172A", light: "#1E293B", dark: "#020617" },
    background: { default: "#FAFAFA", paper: "#FFFFFF" },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    body1: { fontFamily: "'Inter', sans-serif" },
    body2: { fontFamily: "'Inter', sans-serif" },
    button: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      letterSpacing: 0.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
        },
      },
    },
    MuiCard: { styleOverrides: { root: { borderRadius: 20 } } },
  },
});

// ── Service Detail Overlay ────────────────────────────────────────────────────

function ServiceDetail({ service, onClose, onBook }) {
  if (!service) return null;

  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        bgcolor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        onClick={(e) => e.stopPropagation()}
        sx={{
          maxWidth: 700,
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: 4,
          boxShadow: "0 32px 64px rgba(0,0,0,0.2)",
        }}
      >
        {/* Colored header bar */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${service.color} 0%, ${alpha(service.color, 0.85)} 100%)`,
            color: "white",
            p: 4,
            borderRadius: "16px 16px 0 0",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 64, height: 64 }}
            >
              {service.icon}
            </Avatar>
            <Box>
              <Chip
                label={service.category}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.25)",
                  color: "white",
                  mb: 0.5,
                  fontWeight: 600,
                }}
              />
              <Typography variant="h4" fontWeight={700}>
                {service.title}
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ opacity: 0.9, lineHeight: 1.7 }}>{service.description}</Typography>
          <Box sx={{ display: "flex", gap: 4, mt: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: 1 }}>
                PROCESSING TIME
              </Typography>
              <Typography fontWeight={700} fontSize="1.1rem">{service.time}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: 1 }}>
                STARTING FROM
              </Typography>
              <Typography fontWeight={700} fontSize="1.1rem">{service.price}</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {/* What's included */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
                sx={{ color: "#0F172A" }}
              >
                Services Included
              </Typography>
              <List dense>
                {service.sub.map((s) => (
                  <ListItem key={s} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircle
                        sx={{ color: "#22C55E", fontSize: 20 }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={s}
                      primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            {/* Documents needed */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
                sx={{ color: "#0F172A" }}
              >
                Documents Required
              </Typography>
              <List dense>
                {service.docs.map((d) => (
                  <ListItem key={d} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircle sx={{ color: "#F97316", fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={d}
                      primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<CreditCard />}
              onClick={() => {
                onClose();
                onBook();
              }}
              sx={{
                flex: 1,
                minWidth: 160,
                bgcolor: "#F97316",
                py: 1.5,
                fontWeight: 700,
                "&:hover": { bgcolor: "#EA580C" },
              }}
            >
              Book Now
            </Button>

            <Button
              onClick={onClose}
              variant="outlined"
              size="large"
              sx={{
                minWidth: 110,
                borderColor: "#E2E8F0",
                color: "#64748B",
                "&:hover": { borderColor: "#F97316", color: "#F97316" },
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const filtered =
    activeTab === 0
      ? SERVICES
      : SERVICES.filter((s) => s.category === CATEGORIES[activeTab]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        {/* ── Hero ── */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)",
            color: "white",
            py: { xs: 10, md: 14 },
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative elements */}
          <Box
            sx={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "-30%",
              left: "-10%",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: -1,
              left: 0,
              right: 0,
              height: 80,
              background:
                "linear-gradient(to bottom right, transparent 49%, #FAFAFA 50%)",
            }}
          />

          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
                opacity: 0.6,
              }}
            >
              <LocationOn sx={{ fontSize: 16 }} />
              <Typography
                variant="body2"
                sx={{ fontFamily: "'Inter', sans-serif" }}
              >
                Home / Services
              </Typography>
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.2rem", md: "3.5rem" },
                fontWeight: 800,
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Our Professional
              <br />
              <Box component="span" sx={{ color: "#F97316" }}>
                Services
              </Box>
            </Typography>
            <Typography
              sx={{
                opacity: 0.8,
                maxWidth: 560,
                fontSize: "1.1rem",
                mb: 4,
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.9,
              }}
            >
              Expert passport & visa services with 10+ years of experience. We
              handle everything so your journey begins stress-free.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => setPaymentOpen(true)}
                sx={{
                  bgcolor: "#F97316",
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  boxShadow: "0 10px 30px rgba(249,115,22,0.4)",
                  "&:hover": { bgcolor: "#EA580C" },
                }}
              >
                Book Consultation
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Phone />}
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.4)",
                  px: 4,
                  py: 1.5,
                  "&:hover": { borderColor: "#F97316", bgcolor: "rgba(249,115,22,0.1)" },
                }}
              >
                Call Us Now
              </Button>
            </Box>
          </Container>
        </Box>

        {/* ── Stats strip ── */}
        <Container
          maxWidth="lg"
          sx={{ mt: { xs: -2, md: -4 }, position: "relative", zIndex: 10 }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid #E2E8F0",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            }}
          >
            <Grid container>
              {STATS.map((stat, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      borderRight: i < 3 ? "1px solid" : "none",
                      borderColor: "#E2E8F0",
                      background: i % 2 === 0 ? "white" : "#FAFAFA",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "#FFF7ED",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha("#F97316", 0.1),
                        mx: "auto",
                        mb: 1.5,
                        width: 56,
                        height: 56,
                      }}
                    >
                      <Box sx={{ color: "#F97316" }}>{stat.icon}</Box>
                    </Avatar>
                    <Typography variant="h4" sx={{ color: "#0F172A", fontWeight: 800 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>

        {/* ── All Services grid ── */}
        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Chip
              label="WHAT WE OFFER"
              sx={{
                mb: 2,
                letterSpacing: 2,
                bgcolor: alpha("#F97316", 0.1),
                color: "#F97316",
                fontWeight: 700,
              }}
            />
            <Typography variant="h2" sx={{ color: "#0F172A", fontWeight: 800 }} gutterBottom>
              All Our Services
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                maxWidth: 500,
                mx: "auto",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              From passport applications to complex work visas — we've got you
              covered.
            </Typography>
          </Box>

          {/* Category filter pills */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
            <Paper
              elevation={0}
              sx={{ borderRadius: 50, p: 0.75, display: "inline-flex", border: "1px solid #E2E8F0" }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                sx={{
                  "& .MuiTab-root": {
                    borderRadius: 50,
                    minHeight: 44,
                    py: 1,
                    px: 3,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#64748B",
                  },
                  "& .Mui-selected": {
                    bgcolor: "#F97316",
                    color: "white !important",
                  },
                  "& .MuiTabs-indicator": { display: "none" },
                }}
              >
                {CATEGORIES.map((c) => (
                  <Tab key={c} label={c} disableRipple />
                ))}
              </Tabs>
            </Paper>
          </Box>

          <Grid container spacing={3}>
            {filtered.map((service) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: "#E2E8F0",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 24px 48px ${alpha(service.color, 0.2)}`,
                      borderColor: service.color,
                    },
                  }}
                  onClick={() => setSelectedService(service)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(service.color, 0.1),
                        width: 64,
                        height: 64,
                        mb: 2,
                      }}
                    >
                      <Box sx={{ color: service.color }}>{service.icon}</Box>
                    </Avatar>
                    <Chip
                      label={service.category}
                      size="small"
                      sx={{
                        mb: 1.5,
                        bgcolor: alpha(service.color, 0.1),
                        color: service.color,
                        fontWeight: 700,
                        fontSize: "0.7rem",
                      }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      gutterBottom
                      sx={{ color: "#0F172A" }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, lineHeight: 1.6 }}
                    >
                      {service.short}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <AccessTime
                        sx={{ fontSize: 14, color: "text.disabled" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {service.time}
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: service.color,
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: service.color,
                          filter: "brightness(1.1)",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(service);
                      }}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* ── How it works ── */}
        <Box sx={{ bgcolor: "#FFF7ED", py: 10 }}>
          <Container maxWidth="md">
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Chip
                label="HOW IT WORKS"
                sx={{
                  mb: 2,
                  letterSpacing: 2,
                  bgcolor: alpha("#F97316", 0.15),
                  color: "#F97316",
                  fontWeight: 700,
                }}
              />
              <Typography variant="h2" sx={{ color: "#0F172A", fontWeight: 800 }} gutterBottom>
                Our Simple Process
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ fontFamily: "'Inter', sans-serif" }}
              >
                Five easy steps from enquiry to delivery.
              </Typography>
            </Box>
            <Stepper orientation="vertical">
              {PROCESS_STEPS.map((step, i) => (
                <Step key={i} active>
                  <StepLabel
                    icon={
                      <Avatar
                        sx={{
                          bgcolor: i % 2 === 0 ? "#F97316" : "#0F172A",
                          width: 48,
                          height: 48,
                        }}
                      >
                        {step.icon}
                      </Avatar>
                    }
                  >
                    <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
                      Step {i + 1}: {step.label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "#E2E8F0",
                        mb: 2,
                        bgcolor: "white",
                      }}
                    >
                      <Typography
                        color="text.secondary"
                        sx={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}
                      >
                        {step.desc}
                      </Typography>
                    </Paper>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Container>
        </Box>

        {/* ── Pricing packages ── */}
        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Chip
              label="PRICING"
              sx={{
                mb: 2,
                letterSpacing: 2,
                bgcolor: alpha("#F97316", 0.1),
                color: "#F97316",
                fontWeight: 700,
              }}
            />
            <Typography variant="h2" sx={{ color: "#0F172A", fontWeight: 800 }} gutterBottom>
              Service Packages
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ fontFamily: "'Inter', sans-serif" }}
            >
              Choose the plan that fits your needs and budget.
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {PACKAGES.map((pkg, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card
                  sx={{
                    height: "100%",
                    position: "relative",
                    border: pkg.popular ? "2px solid" : "1px solid",
                    borderColor: pkg.popular ? "#F97316" : "#E2E8F0",
                    transform: pkg.popular ? "scale(1.04)" : "none",
                    boxShadow: pkg.popular
                      ? "0 24px 64px rgba(249,115,22,0.2)"
                      : "0 4px 20px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: pkg.popular ? "scale(1.06)" : "scale(1.02)",
                      boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  {pkg.popular && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -1,
                        right: 24,
                        bgcolor: "#F97316",
                        color: "white",
                        px: 2,
                        py: 0.5,
                        borderRadius: "0 0 10px 10px",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: 1,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      MOST POPULAR
                    </Box>
                  )}
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{ color: "#0F172A" }}
                      gutterBottom
                    >
                      {pkg.title}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{ color: "#F97316", fontWeight: 800, mb: 0.5 }}
                    >
                      {pkg.price}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      starting from
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                    <List dense>
                      {pkg.features.map((f) => (
                        <ListItem key={f} disableGutters sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle
                              sx={{ color: "#22C55E", fontSize: 20 }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={f}
                            primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      fullWidth
                      size="large"
                      endIcon={<ArrowForward />}
                      variant={pkg.popular ? "contained" : "outlined"}
                      onClick={() => setPaymentOpen(true)}
                      sx={{
                        mt: 3,
                        py: 1.5,
                        fontWeight: 700,
                        ...(pkg.popular
                          ? {
                              bgcolor: "#F97316",
                              "&:hover": { bgcolor: "#EA580C" },
                            }
                          : {
                              borderColor: "#E2E8F0",
                              color: "#0F172A",
                              "&:hover": { borderColor: "#F97316", color: "#F97316" },
                            }),
                      }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* ── FAQ Section ── */}
        <Box sx={{ bgcolor: "#F8FAFC", py: 10 }}>
          <Container maxWidth="md">
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Chip
                label="FAQ"
                sx={{
                  mb: 2,
                  letterSpacing: 2,
                  bgcolor: alpha("#F97316", 0.1),
                  color: "#F97316",
                  fontWeight: 700,
                }}
              />
              <Typography variant="h2" sx={{ color: "#0F172A", fontWeight: 800 }} gutterBottom>
                Frequently Asked Questions
              </Typography>
            </Box>
            {FAQS.map((faq, i) => (
              <Accordion
                key={i}
                expanded={expandedFaq === i}
                onChange={() => setExpandedFaq(expandedFaq === i ? false : i)}
                sx={{
                  mb: 2,
                  borderRadius: "16px !important",
                  border: "1px solid #E2E8F0",
                  boxShadow: "none",
                  "&:before": { display: "none" },
                  overflow: "hidden",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: "#F97316" }} />}
                  sx={{
                    py: 1,
                    px: 3,
                    "&:hover": { bgcolor: "#FFF7ED" },
                  }}
                >
                  <Typography fontWeight={600} sx={{ color: "#0F172A" }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3 }}>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Container>
        </Box>

        {/* ── CTA Section ── */}
        <Box sx={{ py: 10, bgcolor: "#0F172A" }}>
          <Container maxWidth="md">
            <Box
              sx={{
                textAlign: "center",
                background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
                borderRadius: 4,
                py: 8,
                px: 4,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{ color: "white", mb: 2 }}
              >
                Ready to Start Your Journey?
              </Typography>
              <Typography
                sx={{
                  mb: 4,
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "1.1rem",
                  maxWidth: 500,
                  mx: "auto",
                }}
              >
                Book a free consultation today. Our experts are here to help you every step of the way.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setPaymentOpen(true)}
                  sx={{
                    bgcolor: "white",
                    color: "#F97316",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      bgcolor: "#FFF7ED",
                    },
                  }}
                >
                  Book Consultation
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<WhatsApp />}
                  sx={{
                    color: "white",
                    borderColor: "rgba(255,255,255,0.5)",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                  onClick={() => window.open("https://wa.me/919876500000", "_blank")}
                >
                  WhatsApp Us
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Detail overlay shown when a service card is clicked */}
        <ServiceDetail
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onBook={() => setPaymentOpen(true)}
        />

        {/* Payment Modal */}
        <PaymentModal
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
        />
      </Box>
    </ThemeProvider>
  );
}
