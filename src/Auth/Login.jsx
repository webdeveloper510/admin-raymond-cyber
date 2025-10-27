import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BusinessIcon from "@mui/icons-material/Business";
import logo from "../../src/assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginCompany } from "../Api/api";
import "../../src/assets/css/style.css";

const Login = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    const payload = {
      type: "admin",
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await loginCompany(payload);

      console.log("Login Response:", response);
      if (response.code === "200") {
        localStorage.setItem("access_token", response.data.access_token);
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Something went wrong during login.");
    }
  };

  const handleCancel = () => {
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <Box
      className="loginbg"
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        className="signupBox"
        elevation={3}
        sx={{
          width: 450,
          borderRadius: 3,
          p: 5,
          backdropFilter: "blur(6px)",
          bgcolor: "#FFFFFF",
        }}
      >
        {/* Logo */}
        <Box textAlign="center" mb={2}>
          <img src={logo} alt="AARC Networking" style={{ maxWidth: "150px" }} />
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="center"
          sx={{
            color: "#014260",
            fontSize: "40px",
            marginTop: "20px",
            fontWeight: "700",
            fontFamily: "gilroy",
          }}
        >
          Sign In
        </Typography>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "gilroy",
                fontWeight: 700,
                fontSize: "15px",
                color: "#014260",
                display: "flex",
                justifyContent: "left",
                mb: 0.5,
              }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              placeholder="john.doe@gmail.com"
              value={formData.email}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Box>

          <Box mb={2}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "gilroy",
                fontWeight: 700,
                fontSize: "15px",
                color: "#014260",
                display: "flex",
                justifyContent: "left",
                mb: 0.5,
              }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Box>

          {/* Buttons */}
          <Box display="flex" gap={2} mb={3}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "gilroy",
                height: "50px",
                borderRadius: "10px",
                bgcolor: "#1361A3",
                "&:hover": {
                  bgcolor: "#0d4d7a",
                },
              }}
            >
              Submit
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleCancel}
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "gilroy",
                color: "#669DB1",
                height: "50px",
                borderRadius: "10px",
                borderColor: "#e0e0e0",
                bgcolor: "#f5f5f5",
                "&:hover": {
                  bgcolor: "#e0e0e0",
                  borderColor: "#d0d0d0",
                },
              }}
            >
              Cancel
            </Button>
          </Box>

          <Box textAlign="center" mt={1}>
            <Link
              href="forgot-password"
              underline="none"
              sx={{
                color: "#669DB1",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "gilroy",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot your password?
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
