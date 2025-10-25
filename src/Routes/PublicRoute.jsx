import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ redirectPath = "/dashboard" }) => {
  const userData = localStorage.getItem("access_token");

  if (userData) {
    return <Navigate to={redirectPath} replace />;
  }
       
  return <Outlet />;
};

export default PublicRoute;
