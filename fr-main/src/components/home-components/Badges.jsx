import { Container, Grid, Typography, Box, Avatar } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  GppGood,
  Security,
  WorkspacePremium,
  Verified,
  ThumbUp,
} from "@mui/icons-material";

// ✅ Data (separate for clean code)
const trustBadges = [
  {
    icon: <GppGood />,
    label: "Visa Approved",
    sub: "Government Auth.",
  },
  {
    icon: <Security />,
    label: "100% Secure",
    sub: "Data Protected",
  },
  {
    icon: <WorkspacePremium />,
    label: "Certified Agent",
    sub: "IATA Affiliated",
  },
  {
    icon: <Verified />,
    label: "Verified Co.",
    sub: "GST Registered",
  },
  {
    icon: <ThumbUp />,
    label: "5-Star Rated",
    sub: "Google Reviews",
  },
];

// ✅ Reusable Card Component
const TrustBadgeCard = ({ icon, label, sub, delay }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: alpha("#0D47A1", 0.1),
        bgcolor: "#fff",
        transition: "all 0.3s ease",
        transitionDelay: delay,
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 10px 30px rgba(13,71,161,0.15)",
          transform: "translateY(-6px)",
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: alpha("#0D47A1", 0.08),
          mx: "auto",
          mb: 2,
          width: 56,
          height: 56,
        }}
      >
        <Box sx={{ color: "primary.main", fontSize: 28 }}>{icon}</Box>
      </Avatar>

      <Typography variant="body2" fontWeight={600} color="primary.main">
        {label}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        {sub}
      </Typography>
    </Box>
  );
};

// ✅ Main Section Component
export default function TrustSection() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      {/* Heading */}
      <Typography
        variant="overline"
        display="block"
        align="center"
        sx={{
          letterSpacing: 3,
          color: "text.secondary",
          mb: 6,
        }}
      >
        TRUSTED & CERTIFIED
      </Typography>

      {/* Grid */}
      <Grid container spacing={3} justifyContent="center">
        {trustBadges.map((badge, index) => (
          <Grid item xs={6} sm={4} md={2.4} key={index}>
            <TrustBadgeCard
              icon={badge.icon}
              label={badge.label}
              sub={badge.sub}
              delay={`${index * 0.08}s`}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
} //  {/* ── 9. Trust badges ── */}
//         <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
//           <Typography
//             variant="overline"
//             display="block"
//             textAlign="center"
//             color="text.disabled"
//             sx={{ letterSpacing: 4, mb: 5 }}
//           >
//             TRUSTED & CERTIFIED
//           </Typography>
//           <Grid container spacing={3} justifyContent="center">
//             {[
//               {
//                 icon: <GppGood sx={{ fontSize: 34 }} />,
//                 label: "Visa Approved",
//                 sub: "Government Auth.",
//               },
//               {
//                 icon: <Security sx={{ fontSize: 34 }} />,
//                 label: "100% Secure",
//                 sub: "Data Protected",
//               },
//               {
//                 icon: <WorkspacePremium sx={{ fontSize: 34 }} />,
//                 label: "Certified Agent",
//                 sub: "IATA Affiliated",
//               },
//               {
//                 icon: <Verified sx={{ fontSize: 34 }} />,
//                 label: "Verified Co.",
//                 sub: "GST Registered",
//               },
//               {
//                 icon: <ThumbUp sx={{ fontSize: 34 }} />,
//                 label: "5-Star Rated",
//                 sub: "Google Reviews",
//               },
//             ].map((badge, i) => (
//               <Grid item xs={6} sm={4} md={2} key={i}>
//                 <Box
//                   className="rv"
//                   style={{ transitionDelay: `${i * 0.08}s` }}
//                   sx={{
//                     textAlign: "center",
//                     p: 3,
//                     borderRadius: 4,
//                     border: "1px solid",
//                     borderColor: alpha("#0D47A1", 0.1),
//                     bgcolor: "white",
//                     transition: "all .3s ease",
//                     "&:hover": {
//                       borderColor: "primary.main",
//                       boxShadow: "0 8px 28px rgba(13,71,161,.13)",
//                       transform: "translateY(-5px)",
//                     },
//                   }}
//                 >
//                   <Avatar
//                     sx={{
//                       bgcolor: alpha("#0D47A1", 0.08),
//                       mx: "auto",
//                       mb: 1.5,
//                       width: 58,
//                       height: 58,
//                     }}
//                   >
//                     <Box sx={{ color: "primary.main" }}>{badge.icon}</Box>
//                   </Avatar>
//                   <Typography variant="body2" fontWeight={700} color="primary">
//                     {badge.label}
//                   </Typography>
//                   <Typography variant="caption" color="text.disabled">
//                     {badge.sub}
//                   </Typography>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
