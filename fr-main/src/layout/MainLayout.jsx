import AppAppBar from "../components/home-components/AppAppBar";
import Footer from "../footer/Footer";
import AIChatbot from "../components/AIChatbot";
import { Outlet, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { Box } from "@mui/material";

export default function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";
  const hideFooter = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!hideNavbar && <AppAppBar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: hideNavbar ? 0 : "64px",
        }}
      >
        <Outlet />
      </Box>


      {!hideFooter && (
        <Footer sx={{ pb: 20 }} />
      )}

     
    </Box>
  );
}
