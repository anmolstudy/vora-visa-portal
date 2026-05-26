
import { useNavigate, useLocation } from "react-router-dom";

import { useState, useEffect, useRef } from "react";
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
  IconButton,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import {
  ArrowForward,
  CheckCircle,
  Email,
  ExpandMore,
  Flight,
  FormatQuote,
  GppGood,
  Instagram,
  KeyboardArrowDown,
  LinkedIn,
  LocationOn,
  Phone,
  Security,
  Stars,
  ThumbUp,
  TrackChanges,
  TravelExplore,
  Twitter,
  Verified,
  Visibility,
  WhatsApp,
  WorkspacePremium,
} from "@mui/icons-material";
import { STATS, TIMELINE, TEAM, WHY_US, FAQS } from "./aboutData";

// ── MUI Theme ────────────────────────────────────────────────────────────────

const theme = createTheme({
  palette: {
    primary: { main: "#0D47A1", light: "#1976D2", dark: "#002171" },
    secondary: { main: "#FF6F00", light: "#FFA000", dark: "#E65100" },
    background: { default: "#F8FAFF", paper: "#FFFFFF" },
  },
  typography: {
    fontFamily: "'Playfair Display', Georgia, serif",
    h1: { fontFamily: "'Playfair Display', serif", fontWeight: 800 },
    h2: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    h3: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    h4: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    h5: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    body1: { fontFamily: "'Lato', sans-serif" },
    body2: { fontFamily: "'Lato', sans-serif" },
    button: {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      letterSpacing: 1.5,
    },
    caption: { fontFamily: "'Lato', sans-serif" },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: 8, textTransform: "uppercase" } },
    },
  },
});

// CSS for scroll-reveal animations injected into the <head>
// Classes: .rv (fade up), .rv-l (from left), .rv-r (from right)
// Add class "on" via IntersectionObserver to trigger the animation
const ANIMATION_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Lato:wght@300;400;700&display=swap');
  @keyframes fadeUp  { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(255,111,0,.45)} 50%{box-shadow:0 0 0 18px rgba(255,111,0,0)} }
  @keyframes dotPop  { 0%{transform:scale(0)} 70%{transform:scale(1.25)} 100%{transform:scale(1)} }
  @keyframes scaleIn { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
  .rv   { opacity:0; transform:translateY(36px);  transition:opacity .7s ease,transform .7s ease; }
  .rv-l { opacity:0; transform:translateX(-48px); transition:opacity .7s ease,transform .7s ease; }
  .rv-r { opacity:0; transform:translateX(48px);  transition:opacity .7s ease,transform .7s ease; }
  .rv.on,.rv-l.on,.rv-r.on { opacity:1; transform:none; }
`;

// ── Helper: Animated Counter ──────────────────────────────────────────────────
// Counts from 0 to `target` over `duration` ms once `trigger` becomes true

function useCountUp(target, duration, trigger) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, trigger]);
  return count;
}

// A single stat box with an animated number
function StatCard({ stat, idx, isVisible }) {
  const count = useCountUp(stat.value, 1700 + idx * 120, isVisible);
  return (
    <Box
      className="rv"
      style={{ transitionDelay: `${idx * 0.12}s` }}
      sx={{
        p: { xs: 3, md: 4 },
        textAlign: "center",
        borderRight: {
          md: idx < 3 ? "1px solid rgba(255,255,255,.12)" : "none",
        },
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          mx: "auto",
          mb: 2,
          bgcolor: "rgba(255,255,255,.13)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          animation: isVisible
            ? `float ${2.5 + idx * 0.3}s ease-in-out infinite`
            : "none",
        }}
      >
        {stat.icon}
      </Box>
      <Typography
        variant="h2"
        sx={{
          color: "#FFB300",
          fontWeight: 900,
          lineHeight: 1,
          fontSize: { xs: "2.4rem", md: "3rem" },
        }}
      >
        {count}
        {stat.suffix}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "rgba(255,255,255,.8)", mt: 0.5, letterSpacing: 0.5 }}
      >
        {stat.label}
      </Typography>
    </Box>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AboutPage() {
  const [faqOpen, setFaqOpen] = useState(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [testiIdx, setTestiIdx] = useState(0);
  const [parallaxY, setParallaxY] = useState(0);
  const statsRef = useRef(null);
  const navigate = useNavigate();

  // Add "on" class to every reveal element when it enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("on");
        }),
      { threshold: 0.14 },
    );
    document
      .querySelectorAll(".rv,.rv-l,.rv-r")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });

  // Start stats counter when the stats strip enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Subtle parallax effect on the hero background rings
  useEffect(() => {
    const onScroll = () => setParallaxY(window.scrollY * 0.36);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <style>{ANIMATION_CSS}</style>
      <Box sx={{ bgcolor: "background.default", overflowX: "hidden" }}>
        {/* ── 1. Hero ── */}
        <Box
          sx={{
            height: "100vh",
            minHeight: 600,
            position: "relative",
            background:
              "linear-gradient(135deg,#001050 0%,#0D47A1 50%,#1565C0 100%)",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {/* Parallax rings layer */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              transform: `translateY(${parallaxY}px)`,
              pointerEvents: "none",
            }}
          >
            {[600, 380, 240].map((size, i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.06)",
                  top: [-200, 120, null][i],
                  left: [-200, -100, null][i],
                  bottom: i === 2 ? 60 : null,
                  right: i === 2 ? 200 : null,
                }}
              />
            ))}
          </Box>
          <TravelExplore
            sx={{
              position: "absolute",
              right: { xs: -60, md: 40 },
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: { xs: 260, md: 400 },
              color: "rgba(255,255,255,0.04)",
              pointerEvents: "none",
            }}
          />
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                mb: 3,
                opacity: 0.6,
              }}
            >
              <LocationOn sx={{ fontSize: 15 }} />
              <Typography variant="caption" sx={{ letterSpacing: 2 }}>
                HOME / ABOUT US
              </Typography>
            </Box>
            <Box sx={{ maxWidth: 720, animation: "fadeUp .9s ease both" }}>
              <Chip
                label="ABOUT US"
                sx={{
                  mb: 2.5,
                  bgcolor: "rgba(255,255,255,0.12)",
                  color: "white",
                  letterSpacing: 3,
                  fontSize: ".7rem",
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.6rem", sm: "3.4rem", md: "4.4rem" },
                  color: "white",
                  lineHeight: 1.1,
                  mb: 2,
                }}
              >
                Your Trusted Partner
                <br />
                <Box
                  component="span"
                  sx={{
                    color: "transparent",
                    background: "linear-gradient(90deg,#FFB300,#FF6F00)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  in Visas & Travel
                </Box>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,.82)",
                  fontSize: "1.1rem",
                  lineHeight: 1.9,
                  mb: 5,
                  maxWidth: 560,
                }}
              >
                For over a decade, we've been simplifying passports, visas, and
                travel for thousands of families and professionals across India.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{ px: 4, py: 1.5 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate("/services");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Explore Services
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Phone />}
                  sx={{
                    color: "white",
                    borderColor: "rgba(255,255,255,.45)",
                    px: 4,
                    py: 1.5,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate("/contact");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Contact Us
                </Button>
              </Box>
            </Box>
          </Container>
          {/* Scroll hint */}
          <Box
            sx={{
              position: "absolute",
              bottom: 32,
              left: "50%",
              transform: "translateX(-50%)",
              animation: "float 2s ease-in-out infinite",
              color: "rgba(255,255,255,.45)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              display="block"
              sx={{ letterSpacing: 2, mb: 0.5 }}
            >
              SCROLL
            </Typography>
            <KeyboardArrowDown />
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: -1,
              left: 0,
              right: 0,
              height: 80,
              background:
                "linear-gradient(to bottom right, transparent 49%, #F8FAFF 50%)",
            }}
          />
        </Box>

        {/* ── 2. Animated stats strip ── */}
        <Box
          ref={statsRef}
          sx={{
            background: "linear-gradient(90deg,#001050,#0D47A1,#1565C0)",
            color: "white",
            py: 1,
          }}
        >
          <Container maxWidth="lg">
            <Grid container>
              {STATS.map((s, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <StatCard stat={s} idx={i} isVisible={statsVisible} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ── 3. Company intro ── */}
        <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
          <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
            <Grid item xs={12} md={5}>
              <Box className="rv-l" sx={{ position: "relative" }}>
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "4/3",
                    borderRadius: "28px 28px 80px 28px",
                    background:
                      "linear-gradient(135deg,#002171,#0D47A1,#42A5F5)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "0 28px 72px rgba(13,71,161,.35)",
                    transition: "transform .4s ease",
                    "&:hover": { transform: "scale(1.025) rotate(-1deg)" },
                  }}
                >
                  <TravelExplore
                    sx={{
                      fontSize: 80,
                      mb: 2,
                      opacity: 0.92,
                      animation: "float 4s ease-in-out infinite",
                    }}
                  />
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    textAlign="center"
                    px={4}
                  >
                    Trusted Travel & Visa Consultants
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>
                    Ludhiana, Punjab — Since 2014
                  </Typography>
                </Box>
                <Paper
                  elevation={12}
                  sx={{
                    position: "absolute",
                    bottom: -24,
                    right: -24,
                    px: 3,
                    py: 2.5,
                    borderRadius: "16px 4px 16px 4px",
                    textAlign: "center",
                    border: "3px solid",
                    borderColor: "primary.main",
                    animation: "scaleIn .7s .5s ease both",
                  }}
                >
                  <Typography
                    variant="h4"
                    color="primary"
                    fontWeight={900}
                    sx={{ lineHeight: 1 }}
                  >
                    10+
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Years of
                    <br />
                    Excellence
                  </Typography>
                </Paper>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box className="rv-r">
                <Chip
                  label="WHO WE ARE"
                  color="primary"
                  sx={{ mb: 2.5, letterSpacing: 2, fontWeight: 700 }}
                />
                <Typography
                  variant="h2"
                  color="primary"
                  sx={{ lineHeight: 1.15, mb: 1 }}
                >
                  We Make Your Travel
                  <br />
                  <Box component="span" sx={{ color: "secondary.main" }}>
                    Dreams a Reality
                  </Box>
                </Typography>
                <Box
                  sx={{
                    width: 72,
                    height: 5,
                    borderRadius: 3,
                    mb: 3,
                    background: "linear-gradient(90deg,#FF6F00,#FFB300)",
                  }}
                />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.95, mb: 2.5 }}
                >
                  Founded in 2014, we are a premier passport and visa
                  consultancy based in Ludhiana, Punjab. We help individuals,
                  families, and professionals navigate the complex world of
                  international travel documentation — making it simple, fast,
                  and stress-free.
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.95 }}
                >
                  From first-time passport applications to multi-country work
                  permits, our certified experts handle every case with
                  personalised attention and an unwavering commitment to
                  excellence.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* ── 4. Mission / Vision / Values ── */}
        <Box sx={{ bgcolor: "#EEF2FF", py: { xs: 10, md: 12 } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }} className="rv">
              <Chip
                label="OUR FOUNDATION"
                color="primary"
                sx={{ mb: 2, letterSpacing: 2 }}
              />
              <Typography variant="h2" color="primary" gutterBottom>
                Mission, Vision & Values
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ maxWidth: 480, mx: "auto" }}
              >
                Three pillars that guide every application we process.
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {[
                {
                  icon: <TrackChanges sx={{ fontSize: 44 }} />,
                  title: "Our Mission",
                  color: "#0D47A1",
                  grad: "linear-gradient(135deg,#002171,#1976D2)",
                  text: "To provide accessible, reliable, and expert passport & visa services that empower every individual to travel the world with confidence.",
                },
                {
                  icon: <Visibility sx={{ fontSize: 44 }} />,
                  title: "Our Vision",
                  color: "#1565C0",
                  grad: "linear-gradient(135deg,#0D47A1,#42A5F5)",
                  text: "To be India's most trusted travel documentation company — known for integrity, speed, and the pride we take in every successful journey.",
                },
                {
                  icon: <Stars sx={{ fontSize: 44 }} />,
                  title: "Core Values",
                  color: "#283593",
                  grad: "linear-gradient(135deg,#1A237E,#1976D2)",
                  text: "Transparency in every step. Accuracy in every document. Respect for every client's time.",
                },
              ].map((c, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Box
                    className="rv"
                    style={{ transitionDelay: `${i * 0.15}s` }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        border: "none",
                        transition: "transform .35s ease, box-shadow .35s ease",
                        "&:hover": {
                          transform: "translateY(-12px)",
                          boxShadow: `0 28px 64px ${alpha(c.color, 0.25)}`,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box
                          sx={{
                            width: 78,
                            height: 78,
                            borderRadius: "20px",
                            mb: 3,
                            background: c.grad,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          {c.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          color="primary"
                          fontWeight={700}
                          gutterBottom
                        >
                          {c.title}
                        </Typography>
                        <Box
                          sx={{
                            width: 48,
                            height: 4,
                            background:
                              "linear-gradient(90deg,#FF6F00,#FFB300)",
                            borderRadius: 2,
                            mb: 2.5,
                          }}
                        />
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ lineHeight: 1.9 }}
                        >
                          {c.text}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ── 5. Company timeline ── */}
        <Container maxWidth="md" sx={{ py: { xs: 10, md: 14 } }}>
          <Box sx={{ textAlign: "center", mb: 9 }} className="rv">
            <Chip
              label="OUR JOURNEY"
              color="secondary"
              sx={{ mb: 2, letterSpacing: 2 }}
            />
            <Typography variant="h2" color="primary" gutterBottom>
              A Decade of Trust
            </Typography>
            <Typography color="text.secondary">
              From a small office in Ludhiana to serving thousands across India.
            </Typography>
          </Box>
          <Box sx={{ position: "relative" }}>
            {/* Vertical centre line */}
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: 3,
                background: "linear-gradient(to bottom,#0D47A1,#42A5F5)",
                transform: "translateX(-50%)",
                borderRadius: 2,
                display: { xs: "none", md: "block" },
              }}
            />
            {TIMELINE.map((item, i) => (
              <Box
                key={i}
                className={item.right ? "rv-l" : "rv-r"}
                style={{ transitionDelay: `${i * 0.1}s` }}
                sx={{
                  display: "flex",
                  mb: 6,
                  flexDirection: {
                    xs: "row",
                    md: item.right ? "row" : "row-reverse",
                  },
                  alignItems: "center",
                  gap: { xs: 2, md: 0 },
                }}
              >
                <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }} />
                {/* Centre dot — hidden on mobile */}
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    alignItems: "center",
                    px: 2,
                    zIndex: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      background:
                        i % 2 === 0
                          ? "linear-gradient(135deg,#0D47A1,#1976D2)"
                          : "linear-gradient(135deg,#FF6F00,#FFB300)",
                      width: 56,
                      height: 56,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3.5,
                      borderRadius: "16px",
                      border: "1px solid",
                      borderColor: alpha("#0D47A1", 0.1),
                      mx: { md: 2 },
                      transition: "all .3s ease",
                      "&:hover": {
                        boxShadow: "0 12px 40px rgba(13,71,161,.14)",
                        borderColor: "primary.main",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <Chip
                      label={item.year}
                      color="primary"
                      size="small"
                      sx={{ mb: 1.5, fontWeight: 800 }}
                    />
                    <Typography
                      variant="h6"
                      color="primary"
                      fontWeight={700}
                      gutterBottom
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.8 }}
                    >
                      {item.desc}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>

        {/* ── 6. Why choose us ── */}
        <Box
          sx={{
            background: "linear-gradient(135deg,#001050,#0D47A1)",
            color: "white",
            py: { xs: 10, md: 12 },
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }} className="rv">
              <Chip
                label="WHY US"
                sx={{
                  mb: 2,
                  bgcolor: "rgba(255,255,255,.13)",
                  color: "white",
                  letterSpacing: 2,
                }}
              />
              <Typography variant="h2" gutterBottom>
                Why Thousands Trust Us
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {WHY_US.map((item, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Box
                    className="rv"
                    style={{ transitionDelay: `${i * 0.1}s` }}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      bgcolor: "rgba(255,255,255,.06)",
                      border: "1px solid rgba(255,255,255,.1)",
                      height: "100%",
                      transition: "all .3s ease",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,.12)",
                        transform: "translateY(-6px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 58,
                        height: 58,
                        borderRadius: "14px",
                        bgcolor: "#FFB300",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2.5,
                        color: "white",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ opacity: 0.8, lineHeight: 1.8 }}
                    >
                      {item.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ── 7. Team ── */}
        <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
          <Box sx={{ textAlign: "center", mb: 8 }} className="rv">
            <Chip
              label="MEET THE TEAM"
              color="primary"
              sx={{ mb: 2, letterSpacing: 2 }}
            />
            <Typography variant="h2" color="primary" gutterBottom>
              The Experts Behind Your Journey
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {TEAM.map((member, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box className="rv" style={{ transitionDelay: `${i * 0.12}s` }}>
                  <Card
                    sx={{
                      textAlign: "center",
                      overflow: "hidden",
                      border: "none",
                      boxShadow: "0 4px 24px rgba(13,71,161,.09)",
                      transition: "transform .35s ease, box-shadow .35s ease",
                      "&:hover": {
                        transform: "translateY(-12px)",
                        boxShadow: `0 24px 64px ${alpha(member.color, 0.3)}`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        background: member.grad,
                        pt: 5,
                        pb: 4,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 90,
                          height: 90,
                          mx: "auto",
                          fontSize: "2rem",
                          fontWeight: 800,
                          bgcolor: "rgba(255,255,255,.18)",
                          color: "white",
                          border: "3px solid rgba(255,255,255,.3)",
                        }}
                      >
                        {member.initials}
                      </Avatar>
                      {/* Social links overlay on hover */}
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          bgcolor: alpha(member.color, 0.9),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1.5,
                          opacity: 0,
                          transition: "all .3s ease",
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        {[<LinkedIn />, <Twitter />, <Instagram />].map(
                          (icon, j) => (
                            <IconButton
                              key={j}
                              size="small"
                              sx={{
                                bgcolor: "rgba(255,255,255,.18)",
                                color: "white",
                              }}
                            >
                              {icon}
                            </IconButton>
                          ),
                        )}
                      </Box>
                    </Box>
                    <CardContent>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="primary"
                        gutterBottom
                      >
                        {member.name}
                      </Typography>
                      <Chip
                        label={member.role}
                        size="small"
                        sx={{
                          bgcolor: alpha(member.color, 0.1),
                          color: member.color,
                          fontWeight: 700,
                          mb: 1,
                          fontSize: ".72rem",
                        }}
                      />
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        {member.exp} Experience
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
