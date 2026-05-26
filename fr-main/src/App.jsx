import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/*" element={<AppRoutes />} />
      </Route>
    </Routes>
  );
}
