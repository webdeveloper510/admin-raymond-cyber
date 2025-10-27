import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Auth/Login.jsx";
import DashboardLayout from "../Sidebar/sidebar.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect root "/" to /admin/login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Route>

      {/* Optional 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
