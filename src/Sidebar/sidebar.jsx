import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  AppBar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  VideoLibrary as VideoLibraryIcon,
  Assessment as AssessmentIcon, // ✅ For Test Results
} from "@mui/icons-material";
import logo from "../../src/assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import DashboardOverview from "../Dashboard/Dashboard";
import CompanyRequests from "../Dashboard/CompanyRequest";
import SettingsPage from "../Dashboard/CompanySettings";
import VideoManagement from "../Dashboard/VideoManagement";
import TestResultsManagement from "../Dashboard/TestResults";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Updated menu items with consistent icon usage
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Company Requests", icon: <PeopleIcon /> },
    { text: "Video Management", icon: <VideoLibraryIcon /> },
    { text: "Test Results", icon: <AssessmentIcon /> },
    { text: "Settings", icon: <SettingsIcon /> },
  ];

  const drawerWidth = 240;

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#014260",
            color: "#fff",
            borderRight: "none",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Logo */}
        <Box textAlign="center" sx={{ p: 3 }}>
          <img
            src={logo}
            alt="AARC Networking"
            style={{ maxWidth: "200px", height: "auto" }}
          />
        </Box>

        <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", mx: 2 }} />

        {/* Menu Items */}
        <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={selectedTab === index}
                onClick={() => setSelectedTab(index)}
                sx={{
                  borderRadius: "10px",
                  py: 1.5,
                  "&.Mui-selected": {
                    bgcolor: "#1361A3",
                    "&:hover": { bgcolor: "#1361A3" },
                  },
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedTab === index ? "#fff" : "#669DB1",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontFamily: "gilroy",
                    fontSize: "14px",
                    fontWeight: selectedTab === index ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Logout Button */}
        <Box sx={{ p: 2 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: "10px",
              py: 1.5,
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "#669DB1", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontFamily: "gilroy",
                fontSize: "14px",
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f5f7fa" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "#fff",
            borderBottom: "1px solid #e0e0e0",
          }}
        />
        <Box sx={{ p: 4 }}>
          {selectedTab === 0 && <DashboardOverview />}
          {selectedTab === 1 && <CompanyRequests />}
          {selectedTab === 2 && <VideoManagement />}
          {selectedTab === 3 && <TestResultsManagement />}
          {selectedTab === 4 && <SettingsPage />}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
