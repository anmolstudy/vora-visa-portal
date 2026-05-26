import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Container, Grid } from "@mui/material";
import API from "../../services/api/axios.config.js";
import mainBg from "../../main-media/main-BK.gif"; // adjust path if needed

const CurrentDemand = () => {
  const [demands, setDemands] = useState([]);

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const res = await API.get("/api/demand");
        setDemands(res.data.demands || res.data || []);
      } catch (err) {
        console.error("Error fetching demands:", err);
      }
    };
    fetchDemands();
  }, []);

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 🔹 GIF Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${mainBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />

      {/* 🔹 Dark overlay so text stays readable */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          zIndex: 1,
        }}
      />

      {/* 🔹 Content on top */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          textAlign="center"
          color="white"
        >
          Current Hiring Demands
        </Typography>

        {demands.length === 0 && (
          <Typography textAlign="center" color="white" sx={{ mt: 4 }}>
            No demands yet
          </Typography>
        )}

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {demands?.map((demand) => (
            <Grid item xs={12} md={6} key={demand._id}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.92)",
                  backdropFilter: "blur(6px)",
                }}
              >
                {demand.image && (
                  <Box
                    component="img"
                    src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/uploads/${demand.image}`}
                    alt={demand.title}
                    sx={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "cover",
                      borderRadius: 2,
                      mb: 2,
                    }}
                  />
                )}

                <Typography variant="h6" fontWeight={600}>
                  {demand.title}
                </Typography>
                <Typography variant="body2">
                  Country: {demand.country}
                </Typography>
                <Typography variant="body2">Salary: {demand.salary}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {demand.description}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 2, display: "block" }}
                >
                  Deadline: {new Date(demand.deadline).toLocaleDateString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CurrentDemand; // import React, { useEffect, useState } from "react";
// import { Box, Typography, Paper, Container, Grid } from "@mui/material";
// import API from "../../services/api/axios.config.js";

// const CurrentDemand = () => {
//   const [demands, setDemands] = useState([]);

//   // 🔹 Fetch demands from backend
//   useEffect(() => {
//     const fetchDemands = async () => {
//       try {
//         const res = await API.get("/demand"); // baseURL includes /api
//         console.log("Fetched demands:", res.data); // Debug log
//         setDemands(res.data);
//       } catch (err) {
//         console.error("Error fetching demands:", err);
//       }
//     };

//     fetchDemands();
//   }, []);

//   return (
//     <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: "#f8fafc" }}>
//       <Container maxWidth="lg">
//         <Typography
//           variant="h4"
//           fontWeight={700}
//           gutterBottom
//           textAlign="center"
//         >
//           Current Hiring Demands
//         </Typography>

//         {demands.length === 0 && (
//           <Typography textAlign="center" sx={{ mt: 4 }}>
//             No demands yet
//           </Typography>
//         )}

//         <Grid container spacing={4} sx={{ mt: 2 }}>
//           {demands.map((demand) => (
//             <Grid item xs={12} md={6} key={demand._id}>
//               <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
//                 {/* ✅ Image */}
//                 {demand.image && (
//                   <Box
//                     component="img"
//                     src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/uploads/${demand.image}`}
//                     alt={demand.title}
//                     sx={{
//                       width: "100%",
//                       maxHeight: 300,
//                       objectFit: "cover",
//                       borderRadius: 2,
//                       mb: 2,
//                     }}
//                   />
//                 )}

//                 {/* ✅ Details */}
//                 <Typography variant="h6" fontWeight={600}>
//                   {demand.title}
//                 </Typography>
//                 <Typography variant="body2">
//                   Country: {demand.country}
//                 </Typography>
//                 <Typography variant="body2">Salary: {demand.salary}</Typography>
//                 <Typography variant="body2" sx={{ mt: 1 }}>
//                   {demand.description}
//                 </Typography>
//                 <Typography
//                   variant="caption"
//                   color="text.secondary"
//                   sx={{ mt: 2, display: "block" }}
//                 >
//                   Deadline: {new Date(demand.deadline).toLocaleDateString()}
//                 </Typography>
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default CurrentDemand;
