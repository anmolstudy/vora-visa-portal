import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import CurrentDemand from '../components/home-components/CurrentDemand';

// Icons
import Star from "@mui/icons-material/Star";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import SupportAgent from "@mui/icons-material/SupportAgent";
import Phone from "@mui/icons-material/Phone";
import WhatsApp from "@mui/icons-material/WhatsApp";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import PublicIcon from "@mui/icons-material/Public";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import SupportIcon from "@mui/icons-material/Support";
import PaymentModal from "../components/PaymentModal";
import Globe3D from "../components/Globe3D";

// Phone number and WhatsApp configuration
const PHONE_NUMBER = "+919876500000";
const WHATSAPP_NUMBER = "919876500000";

// DATA FOR SERVICES
const services = [
  {
    title: "Work Visa",
    desc: "Expert assistance for professional work permits and job-based immigration across 50+ countries.",
    icon: <WorkIcon sx={{ fontSize: 40, color: "#F97316" }} />,
    color: "#FFF7ED",
    gradient: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
  },
  {
    title: "Student Visa",
    desc: "Comprehensive guidance for study abroad programs with university placement support.",
    icon: <SchoolIcon sx={{ fontSize: 40, color: "#059669" }} />,
    color: "#ECFDF5",
    gradient: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
  },
  {
    title: "Immigration",
    desc: "Smooth processing for Permanent Residency and citizenship applications worldwide.",
    icon: <PublicIcon sx={{ fontSize: 40, color: "#0EA5E9" }} />,
    color: "#F0F9FF",
    gradient: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
  },
  {
    title: "Travel Bookings",
    desc: "Hassle-free flight, hotel, and accommodation bookings for your journey.",
    icon: <ConfirmationNumberIcon sx={{ fontSize: 40, color: "#DC2626" }} />,
    color: "#FEF2F2",
    gradient: "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)",
  },
];

// DATA FOR REVIEWS
const reviews = [
  {
    name: "Sukhi Maan",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    time: "3 years ago",
    rating: 5,
    comment: "Best service ever in all over Punjab and they also gave me good guidance about my future. Highly recommended!",
  },
  {
    name: "Johar Singh",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    time: "3 years ago",
    rating: 5,
    comment: "I have very good experience with Pathwayz Immigration. Professional team and excellent service.",
  },
  {
    name: "Unti Goel",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    time: "3 years ago",
    rating: 5,
    comment: "Entire team supported me throughout the process. Got my visa approved in record time. Highly recommended!",
  },
  {
    name: "Priya Sharma",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    time: "2 years ago",
    rating: 5,
    comment: "Amazing experience! They helped me with my Canada PR application and made everything so simple.",
  },
  {
    name: "Rahul Verma",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    time: "1 year ago",
    rating: 5,
    comment: "Professional, transparent and reliable. Got my work visa approved without any hassle. Thank you Vora team!",
  },
];

// Stats data
const stats = [
  { icon: <GroupsIcon sx={{ fontSize: 36 }} />, value: "15,000+", label: "Happy Clients" },
  { icon: <EmojiEventsIcon sx={{ fontSize: 36 }} />, value: "10+", label: "Years Experience" },
  { icon: <PublicIcon sx={{ fontSize: 36 }} />, value: "50+", label: "Countries Covered" },
  { icon: <ThumbUpIcon sx={{ fontSize: 36 }} />, value: "98%", label: "Success Rate" },
];

// Why choose us data
const whyChooseUs = [
  {
    icon: <SpeedIcon sx={{ fontSize: 32 }} />,
    title: "Fast Processing",
    desc: "Quick turnaround times with priority handling",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 32 }} />,
    title: "100% Secure",
    desc: "Your documents are handled with utmost care",
  },
  {
    icon: <SupportIcon sx={{ fontSize: 32 }} />,
    title: "24/7 Support",
    desc: "Round-the-clock assistance for all queries",
  },
  {
    icon: <RocketLaunchIcon sx={{ fontSize: 32 }} />,
    title: "Expert Team",
    desc: "Seasoned professionals with global expertise",
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const Homepage = () => {
  const navigate = useNavigate();
    const location = useLocation();
  const [paymentOpen, setPaymentOpen] = useState(false);

    // Auto-open payment modal if redirected back from login with openPayment flag
  useEffect(() => {
    if (location.state?.openPayment) {
      setPaymentOpen(true);
      // Clear the state so refreshing doesn't re-open it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hello! I'm interested in your visa services.`, "_blank");
  };

  const handlePhoneClick = (e) => {
    e.preventDefault();
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  const handleApplyNow = (e) => {
    e.preventDefault();
    setPaymentOpen(true);
  };

  const handleLearnMore = (e) => {
    e.preventDefault();
    navigate("/services");
  };

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* HERO SECTION */}
      <section
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)",
          paddingTop: "120px",
          paddingBottom: "80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)",
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

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 4, md: 8 }
          }}>
            {/* Left content */}
            <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
              <Chip
                label="TRUSTED BY 15,000+ CLIENTS"
                sx={{
                  bgcolor: "rgba(249,115,22,0.15)",
                  color: "#F97316",
                  fontWeight: 700,
                  letterSpacing: 1,
                  mb: 3,
                  fontSize: "0.75rem",
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  color: "white",
                  fontWeight: 800,
                  fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Your Gateway to
                <Box component="span" sx={{ color: "#F97316", display: "block" }}>
                  Global Opportunities
                </Box>
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: { xs: "1rem", md: "1.15rem" },
                  lineHeight: 1.8,
                  mb: 4,
                  maxWidth: "500px",
                  mx: { xs: "auto", md: 0 },
                }}
              >
                Expert guidance for Student Visas, Work Permits, PR Applications, and Travel Services.
                Making your dreams a reality since 2014.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "center", md: "flex-start" }, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleApplyNow}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: "#F97316",
                    color: "white",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: "0 10px 30px rgba(249,115,22,0.4)",
                    "&:hover": {
                      bgcolor: "#EA580C",
                      transform: "translateY(-2px)",
                      boxShadow: "0 14px 40px rgba(249,115,22,0.5)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Apply Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleLearnMore}
                  sx={{
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "white",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      borderColor: "#F97316",
                      bgcolor: "rgba(249,115,22,0.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Learn More
                </Button>
              </Box>

              {/* Quick features */}
              <Box sx={{ display: "flex", gap: 3, mt: 5, flexWrap: "wrap", justifyContent: { xs: "center", md: "flex-start" } }}>
                {["Free Consultation", "Expert Team", "Fast Processing"].map((text, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon sx={{ color: "#22C55E", fontSize: 20 }} />
                    <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem" }}>
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Right content - Hero image */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "300px", md: "450px" },
                  height: { xs: "300px", md: "400px" },
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=400&fit=crop"
                  alt="Travel"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "24px",
                    boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
                  }}
                />
                {/* Floating card */}
                <Paper
                  sx={{
                    position: "absolute",
                    bottom: "-20px",
                    left: "-30px",
                    bgcolor: "white",
                    p: 2,
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    display: { xs: "none", sm: "flex" },
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box sx={{ bgcolor: "#FFF7ED", p: 1.5, borderRadius: "12px" }}>
                    <FlightTakeoffIcon sx={{ color: "#F97316", fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>98%</Typography>
                    <Typography variant="body2" color="text.secondary">Success Rate</Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Container>
      </section>



      {/* STATS SECTION */}
      <section style={{
        background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
        padding: "50px 0",
        marginTop: "-30px",
        position: "relative",
        zIndex: 2,
      }}>
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              gap: 4,
            }}
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Box sx={{ textAlign: "center", color: "white" }}>
                  <Box sx={{ mb: 1.5, opacity: 0.9 }}>{stat.icon}</Box>
                  <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5 }}>{stat.value}</Typography>
                  <Typography sx={{ opacity: 0.9, fontSize: "0.95rem" }}>{stat.label}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </section>

      <CurrentDemand />
      {/* SERVICES SECTION */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: "#FAFAFA" }}>
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            sx={{ textAlign: "center", mb: 8 }}
          >
            <Chip
              label="WHAT WE OFFER"
              sx={{
                bgcolor: "rgba(249,115,22,0.1)",
                color: "#F97316",
                fontWeight: 700,
                letterSpacing: 1,
                mb: 2,
              }}
            />
            <Typography variant="h3" fontWeight={800} sx={{ mb: 2, color: "#0F172A" }}>
              Our Expert Services
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: "600px", mx: "auto", fontSize: "1.05rem" }}>
              Comprehensive visa and immigration services tailored to your needs with guaranteed satisfaction.
            </Typography>
          </Box>

          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
              gap: 3,
            }}
          >
            {services.map((service, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Paper
                  elevation={0}
                  onClick={() => navigate("/services")}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: "24px",
                    border: "1px solid #E5E7EB",
                    bgcolor: "white",
                    cursor: "pointer",
                    height: "100%",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-12px)",
                      boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
                      borderColor: "#F97316",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      background: service.gradient,
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1) rotate(5deg)",
                      },
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, color: "#0F172A" }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {service.desc}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* WHY CHOOSE US SECTION */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            sx={{ textAlign: "center", mb: 8 }}
          >
            <Chip
              label="WHY US"
              sx={{
                bgcolor: "rgba(249,115,22,0.1)",
                color: "#F97316",
                fontWeight: 700,
                letterSpacing: 1,
                mb: 2,
              }}
            />
            <Typography variant="h3" fontWeight={800} sx={{ mb: 2, color: "#0F172A" }}>
              Why Choose Vora?
            </Typography>
          </Box>

          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
              gap: 3,
            }}
          >
            {whyChooseUs.map((item, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: "20px",
                    bgcolor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "#FFF7ED",
                      borderColor: "#F97316",
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: "#F97316",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                      color: "white",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: "#0F172A" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* TESTIMONIALS SECTION */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: "#FAFAFA", overflow: "hidden" }}>
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            sx={{ textAlign: "center", mb: 6 }}
          >
            <Chip
              label="TESTIMONIALS"
              sx={{
                bgcolor: "rgba(249,115,22,0.1)",
                color: "#F97316",
                fontWeight: 700,
                letterSpacing: 1,
                mb: 2,
              }}
            />
            <Typography variant="h3" fontWeight={800} sx={{ mb: 2, color: "#0F172A" }}>
              What Our Clients Say
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "max-content",
              animation: "scrollLeft 40s linear infinite",
              "&:hover": { animationPlayState: "paused" },
              "@keyframes scrollLeft": {
                "0%": { transform: "translateX(0)" },
                "100%": { transform: "translateX(-50%)" },
              },
            }}
          >
            {[...reviews, ...reviews].map((review, i) => (
              <Paper
                key={i}
                elevation={0}
                sx={{
                  width: 380,
                  p: 4,
                  mx: 1.5,
                  borderRadius: "24px",
                  flexShrink: 0,
                  border: "1px solid #E5E7EB",
                  bgcolor: "white",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", mb: 3 }}>
                  {[...Array(review.rating)].map((_, index) => (
                    <Star key={index} sx={{ color: "#F97316", fontSize: 24 }} />
                  ))}
                </Box>
                <Typography
                  variant="body1"
                  sx={{ mb: 4, lineHeight: 1.8, color: "#374151", fontStyle: "italic", fontSize: "1rem" }}
                >
                  "{review.comment}"
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={review.avatarUrl}
                    sx={{ width: 52, height: 52, border: "3px solid #F97316" }}
                  />
                  <Box>
                    <Typography fontWeight={700} sx={{ color: "#0F172A" }}>{review.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{review.time}</Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA SECTION */}
      <Box sx={{ py: { xs: 10, md: 12 }, bgcolor: "#0F172A" }}>
        <Container maxWidth="md">
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            sx={{
              textAlign: "center",
              background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
              borderRadius: "32px",
              py: { xs: 7, md: 9 },
              px: { xs: 3, md: 6 },
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative */}
            <SupportAgent
              sx={{
                position: "absolute",
                top: -30,
                right: -30,
                opacity: 0.1,
                fontSize: 220,
                color: "white",
              }}
            />

            <Chip
              label="24/7 SUPPORT"
              sx={{
                mb: 3,
                color: "white",
                borderColor: "rgba(255,255,255,0.5)",
                bgcolor: "rgba(255,255,255,0.15)",
                fontWeight: 700,
              }}
            />
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ color: "white", mb: 2, fontSize: { xs: "1.75rem", md: "2.5rem" } }}
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
              Free consultation available. Our experts are here to help you every step of the way.
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
                startIcon={<Phone />}
                onClick={handlePhoneClick}
                sx={{
                  bgcolor: "white",
                  color: "#F97316",
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    bgcolor: "#FFF7ED",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Call Us Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<WhatsApp />}
                onClick={handleWhatsAppClick}
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.5)",
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                WhatsApp Us
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
      />
    </div>
  );
};

export default Homepage;
