import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Tooltip,
  Fab,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  LinkedIn,
  Phone,
  WhatsApp,
  Email,
  LocationOn,
  KeyboardArrowUp,
  Flight,
} from "@mui/icons-material";
import AIChatbot from "../components/AIChatbot";

// Configuration
const PHONE_NUMBER = "+919876500000";
const WHATSAPP_NUMBER = "919876500000";
const EMAIL = "info@vora.in";

const links = [
  { label: "Home", path: "/home" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
  { label: "FAQ", path: "/faq" },
];

const socialLinks = [
  { icon: <Facebook />, label: "Facebook", url: "https://facebook.com" },
  { icon: <Instagram />, label: "Instagram", url: "https://instagram.com" },
  { icon: <LinkedIn />, label: "LinkedIn", url: "https://linkedin.com" },
];

// Floating action buttons component
function FloatingButtons() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hello! I'm interested in your visa services.`, "_blank");
  };

  const handlePhoneClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
     {/* AIChatbot handles its own fixed positioning */}
     <AIChatbot /> 
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        zIndex: 1200,
      }}
    >
      {/* Scroll to top button */}
      <Fab
        size="small"
        onClick={scrollToTop}
        sx={{
          bgcolor: "#1E293B",
          color: "white",
          opacity: showScroll ? 1 : 0,
          transform: showScroll ? "scale(1)" : "scale(0)",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "#334155",
          },
        }}
      >
        <KeyboardArrowUp />
      </Fab>

      {/* Phone button */}
      <Tooltip title="Call Us" placement="left">
        <Fab
          size="medium"
          onClick={handlePhoneClick}
          sx={{
            bgcolor: "#F97316",
            color: "white",
            "&:hover": {
              bgcolor: "#EA580C",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <Phone />
        </Fab>
      </Tooltip>

      {/* WhatsApp button */}
      <Tooltip title="WhatsApp Us" placement="left">
        <Fab
          size="medium"
          onClick={handleWhatsAppClick}
          sx={{
            bgcolor: "#25D366",
            color: "white",
            "&:hover": {
              bgcolor: "#128C7E",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <WhatsApp />
        </Fab>
      </Tooltip>

      {/* <Tooltip title="AI Assistant" placement="left">
        <AIChatbot />

      </Tooltip> */}
    </Box>
    </>
    
  );
}

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e, path) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSocialClick = (e, url) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank");
  };

  const handlePhoneClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  const handleEmailClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `mailto:${EMAIL}`;
  };

  // Don't show footer on login/signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return <FloatingButtons />;
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: "#0F172A",
          color: "white",
          pt: 8,
          pb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              gap: 4,
              mb: 6,
            }}
          >
            {/* Brand */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 45,
                    height: 45,
                    borderRadius: "12px",
                    bgcolor: "#F97316",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Flight sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    VORA
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#F97316", letterSpacing: 1 }}>
                    VISA & TRAVEL
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.8, mb: 2 }}>
                Your trusted partner for passports, visas & travel since 2014.
                Serving thousands of families across India.
              </Typography>
            </Box>

            {/* Quick Links */}
            <Box>
              <Typography fontWeight={700} mb={2} sx={{ color: "#F97316" }}>
                Quick Links
              </Typography>
              {links.map((item, i) => (
                <Typography
                  key={i}
                  variant="body2"
                  onClick={(e) => handleNavClick(e, item.path)}
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    mb: 1.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      opacity: 1,
                      color: "#F97316",
                      pl: 1,
                    }
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>

            {/* Contact */}
            <Box>
              <Typography fontWeight={700} mb={2} sx={{ color: "#F97316" }}>
                Contact Us
              </Typography>
              <Box
                onClick={handlePhoneClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": { color: "#F97316" },
                }}
              >
                <Phone sx={{ fontSize: 18, color: "#F97316" }} />
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  +91 98765 00000
                </Typography>
              </Box>
              <Box
                onClick={handleEmailClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": { color: "#F97316" },
                }}
              >
                <Email sx={{ fontSize: 18, color: "#F97316" }} />
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  info@vora.in
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <LocationOn sx={{ fontSize: 18, color: "#F97316", mt: 0.3 }} />
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Model Town, Jalandhar, Punjab
                </Typography>
              </Box>
            </Box>

            {/* Social */}
            <Box>
              <Typography fontWeight={700} mb={2} sx={{ color: "#F97316" }}>
                Follow Us
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
                Stay connected with us on social media for updates and news.
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {socialLinks.map((social, i) => (
                  <Tooltip key={i} title={social.label}>
                    <IconButton
                      onClick={(e) => handleSocialClick(e, social.url)}
                      sx={{
                        color: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                        "&:hover": {
                          bgcolor: "#F97316",
                          transform: "translateY(-3px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.1)", mb: 3 }} />

          {/* Bottom */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.5 }}>
              © {new Date().getFullYear()} Vora Visa & Travel. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Typography
                variant="body2"
                sx={{ opacity: 0.5, cursor: "pointer", "&:hover": { opacity: 1 } }}
              >
                Privacy Policy
              </Typography>
              <Typography
                variant="body2"
                sx={{ opacity: 0.5, cursor: "pointer", "&:hover": { opacity: 1 } }}
              >
                Terms of Service
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <FloatingButtons />
    </>
  );
}
