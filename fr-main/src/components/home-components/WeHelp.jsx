import { Container, Grid, Typography, Box, Divider } from "@mui/material";
import { alpha } from "@mui/material/styles";
import LanguageIcon from "@mui/icons-material/Language";
import PersonIcon from "@mui/icons-material/Person";
import FlightIcon from "@mui/icons-material/Flight";
import abcd from "../../main-media/abcd.png";
const visaCards = [
  {
    icon: <LanguageIcon sx={{ fontSize: 48, color: "#c0392b" }} />,
    title: "Tourist Visa",
    desc: "A tourist visa allows a foreign national to enter a country temporarily for leisure, sightseeing, or visiting family and friends.",
  },
  {
    icon: <PersonIcon sx={{ fontSize: 48, color: "#c0392b" }} />,
    title: "Student Visa",
    desc: "A student visa allows a foreign citizen to legally enter a country to pursue higher education at recognized institutions.",
  },
  {
    icon: <FlightIcon sx={{ fontSize: 48, color: "#c0392b" }} />,
    title: "Investor Visa",
    desc: "Investor visas allow foreign nationals to gain residency or citizenship by making significant investments in a country.",
  },
];

const stats = [
  { number: "560", label: "We Have Worked With Clients" },
  { number: "99%", label: "Successful Visa Process Rate" },
  { number: "42 hrs", label: "Application Approval Time" },
];

export default function VisaSection() {
  return (
    <Box sx={{ bgcolor: "#fff" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        {/* ── Top Section ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 5,
            mb: 8,
          }}
        >
          {/* Left Content */}
          <Box sx={{ flex: 1, maxWidth: 520 }}>
            <Typography
              sx={{
                color: "#c0392b",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                mb: 1.5,
              }}
            >
              HOW WE HELP CLIENTS
            </Typography>

            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#111", lineHeight: 1.3, mb: 1 }}
            >
              Level With Great Visa Serving Policies
            </Typography>

            <Typography
              sx={{
                color: "#c0392b",
                fontSize: "13px",
                fontWeight: 500,
                mb: 1.5,
              }}
            >
              Best Visa Consultants in Ludhiana
            </Typography>

            <Box
              sx={{
                width: 36,
                height: 3,
                bgcolor: "#c0392b",
                borderRadius: 1,
                mb: 3,
              }}
            />

            <Typography
              sx={{ color: "#555", fontSize: "14px", lineHeight: 1.8 }}
            >
              We provide skilled staff to help you get the most out of your
              immigration process. Our qualified consultants assist you in
              achieving a successful outcome.
            </Typography>
          </Box>

          {/* Right Image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: { lg: 1 },
            }}
          >
            <Box
              component="img"
              src={abcd}
              alt="Visa"
              sx={{
                width: 200,
                height: 200,
                objectFit: "contain",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
            />
          </Box>
        </Box>

        {/* ── Visa Cards ── */}
        <Grid container spacing={4}>
          {visaCards.map((card, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Box
                sx={{
                  textAlign: "center",
                  px: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  {card.icon}
                </Box>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#111", mb: 1.5 }}
                >
                  {card.title}
                </Typography>

                <Typography
                  sx={{ color: "#666", fontSize: "13.5px", lineHeight: 1.8 }}
                >
                  {card.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── Stats Section ── */}
      <Box sx={{ borderTop: "1px solid", borderColor: alpha("#000", 0.1) }}>
        <Container maxWidth="lg">
          <Grid container>
            {stats.map((s, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Box
                  sx={{
                    textAlign: "center",
                    py: 5,
                    px: 3,
                    borderRight: i < 2 ? { md: "1px solid" } : "none",
                    borderColor: alpha("#000", 0.1),
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "2.5rem", md: "3rem" },
                      fontWeight: 700,
                      color: "#111",
                      mb: 1,
                    }}
                  >
                    {s.number}
                  </Typography>

                  <Typography sx={{ color: "#777", fontSize: "13px" }}>
                    {s.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
