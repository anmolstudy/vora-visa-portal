import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import About from "../pages/Nav-Button/About";
import Contact from "../pages/Nav-Button/Contact";
import FAQ from "../pages/Nav-Button/FAQ";
import Services from "../pages/Nav-Button/Services";
import ContactForm from "../pages/ContactForm";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="login" element={<Login />} />
      <Route path="/reset-password/:token" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="home" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="services" element={<Services />} />
      <Route path="ContactForm" element={<ContactForm />} />
    </Routes>
  );
}
