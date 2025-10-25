import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../Auth/Login.jsx";
// import Signup from "../Auth/Signup.jsx";
// import ForgotPassword from "../Auth/ForgotPassword.jsx";
// // import ResetPassword from "../Auth/ResetPassword.jsx";
// import TwoFactorAuth from "../Auth/OtpSend.jsx";
// import TwoFactorVerify from "../Auth/OtpVerify.jsx";
import DashboardLayout from "../Sidebar/sidebar.jsx";
// import TransactionSuccess from "../Auth/TranscationSuccess.jsx";
// import NotFound from "../pages/NotFound.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
// import PaymentSuccessRoute from "./PaymentSuccessCheck.jsx";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
          {/* <Route path="/2fa" element={<TwoFactorAuth />} />
           <Route path="/otp-verify" element={<TwoFactorVerify />} /> */}
        {/* <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword/>}/> */}
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Route>

      {/* 404 Page */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;