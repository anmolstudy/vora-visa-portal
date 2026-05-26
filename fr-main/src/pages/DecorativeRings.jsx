import { Box } from "@mui/material";
import { TravelExplore } from "@mui/icons-material";

export default function DecorativeRings() {
  return (
    <>
      {/* Top-right rings */}
      {[420, 290, 170].map((size, i) => (
        <Box
          key={`tr-${i}`}
          sx={{
            position: "absolute",
            borderRadius: "50%",
            width: size,
            height: size,
            border: "1px solid rgba(255,255,255,0.07)",
            top: ["-130px", "-30px", "70px"][i],
            right: ["-130px", "30px", "180px"][i],
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Bottom-left rings */}
      {[320, 200].map((size, i) => (
        <Box
          key={`bl-${i}`}
          sx={{
            position: "absolute",
            borderRadius: "50%",
            width: size,
            height: size,
            border: "1px solid rgba(255,255,255,0.05)",
            bottom: ["-100px", "-20px"][i],
            left: ["-100px", "40px"][i],
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Faint globe icon — purely decorative */}
      <Box
        sx={{
          position: "absolute",
          bottom: -60,
          right: -60,
          opacity: 0.05,
          pointerEvents: "none",
        }}
      >
        <TravelExplore sx={{ fontSize: 320 }} />
      </Box>
    </>
  );
}
