import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ redirectPath = "/" }) => {
  const token = localStorage.getItem("access_token");

  if (!token) return <Navigate to={redirectPath} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
