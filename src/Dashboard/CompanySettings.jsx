import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { getProfileDetail, updateProfile } from "../Api/api";
const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setFetchingData(true);
        const response = await getProfileDetail();

        if (response && response.data) {
          setFormData({
            companyName: response.data.company_name || "",
            companyEmail: response.data.email || "",
            companyPhone: response.data.cell_number || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile details:", error);
        setSnackbar({
          open: true,
          message: "Error loading profile details",
          severity: "error",
        });
      } finally {
        setFetchingData(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async () => {
    if (
      !formData.companyName ||
      !formData.companyEmail ||
      !formData.companyPhone
    ) {
      setSnackbar({
        open: true,
        message: "Please fill all fields",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        company_name: formData.companyName,
        email: formData.companyEmail,
        cell_number: formData.companyPhone,
      };

      const response = await updateProfile(profileData);

      if (response && response.message) {
        setSnackbar({
          open: true,
          message: response.message || "Settings saved successfully",
          severity: "success",
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error saving settings",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleConfigureDuo = () => {
    setSnackbar({
      open: true,
      message: "Duo Authentication configuration opened",
      severity: "info",
    });
  };

  if (fetchingData) {
    return (
      <Box
        sx={{
          bgcolor: "#E8F1F5",
          minHeight: "100vh",
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#2B7A9B" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#E8F1F5", minHeight: "100vh", p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box
            sx={{
              bgcolor: "#6FA9C3",
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SettingsIcon sx={{ color: "#fff", fontSize: 26 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#2C4A5A",
                fontWeight: 600,
                fontFamily: "gilroy",
                fontSize: "22px",
              }}
            >
              Settings
            </Typography>
            <Typography
              sx={{
                color: "#7A8F9C",
                fontFamily: "gilroy",
                fontSize: "13px",
                mt: 0.2,
              }}
            >
              Manage company, preferences and configuration
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Company Information Card */}
      <Card
        sx={{
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          border: "none",
          bgcolor: "#fff",
          mb: 2.5,
          p: 3,
        }}
      >
        <Box sx={{ mb: 3, textAlign: "left" }}>
          <Typography
            sx={{
              color: "#2C4A5A",
              fontWeight: 600,
              fontFamily: "gilroy",
              fontSize: "15px",
              mb: 0.3,
            }}
          >
            Company Information
          </Typography>
          <Typography
            sx={{
              color: "#7A8F9C",
              fontFamily: "gilroy",
              fontSize: "12px",
            }}
          >
            Update your company details
          </Typography>
        </Box>

        {/* Form Fields */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2.5 }}>
          {/* Company Name */}
          <Box>
            <Typography
              sx={{
                color: "#014260",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "gilroy",
                fontStyle: "bold",
                display: "flex",
                mb: 0.6,
              }}
            >
              Company Name
            </Typography>
            <TextField
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              fullWidth
              size="small"
              placeholder="Enter company name"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  fontFamily: "gilroy",
                  fontSize: "14px",
                  bgcolor: "#F8FAFB",
                  "& fieldset": {
                    borderColor: "#DDE5EA",
                  },
                  "&:hover fieldset": {
                    borderColor: "#6FA9C3",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6FA9C3",
                    borderWidth: "1px",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#2C4A5A",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#A0B0BC",
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Company Email */}
          <Box>
            <Typography
              sx={{
                color: "#014260",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "gilroy",
                fontStyle: "bold",
                display: "flex",
                mb: 0.6,
              }}
            >
              Company Email
            </Typography>
            <TextField
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleInputChange}
              fullWidth
              size="small"
              placeholder="Enter company email"
              variant="outlined"
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  fontFamily: "gilroy",
                  fontSize: "14px",
                  bgcolor: "#F8FAFB",
                  "& fieldset": {
                    borderColor: "#DDE5EA",
                  },
                  "&:hover fieldset": {
                    borderColor: "#6FA9C3",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6FA9C3",
                    borderWidth: "1px",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#2C4A5A",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#A0B0BC",
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Company Phone */}
          <Box>
            <Typography
              sx={{
                color: "#014260",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "gilroy",
                fontStyle: "bold",
                display: "flex",
                mb: 0.6,
              }}
            >
              Company Phone
            </Typography>
            <TextField
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleInputChange}
              fullWidth
              size="small"
              placeholder="Enter company phone"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  fontFamily: "gilroy",
                  fontSize: "14px",
                  bgcolor: "#F8FAFB",
                  "& fieldset": {
                    borderColor: "#DDE5EA",
                  },
                  "&:hover fieldset": {
                    borderColor: "#6FA9C3",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6FA9C3",
                    borderWidth: "1px",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#2C4A5A",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#A0B0BC",
                  opacity: 1,
                },
              }}
            />
          </Box>
        </Box>

        {/* Save Button */}
        <Button
          onClick={handleSaveChanges}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: "#2B7A9B",
            color: "#fff",
            borderRadius: "6px",
            textTransform: "none",
            fontWeight: 600,
            display: "flex",
            fontFamily: "gilroy",
            fontSize: "13px",
            px: 3,
            py: 0.8,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#236485",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              bgcolor: "#A0B0BC",
              color: "#fff",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "#fff" }} />
          ) : (
            "Save Changes"
          )}
        </Button>
      </Card>

      {/* Duo Authentication Card */}
      <Card
        sx={{
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          border: "none",
          bgcolor: "#fff",
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ flex: 1, pr: 2 }}>
            <Typography
              sx={{
                color: "#262A41",
                fontWeight: 600,
                display: "flex",
                fontFamily: "Lufga",
                fontSize: "19px",
                mb: 0.3,
              }}
            >
              Duo Authentication
            </Typography>
            <Box className="new_out">
              <Typography
                sx={{
                  color: "#22394C",
                  fontFamily: "Lufga",
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "flex",
                  fontStyle: "medium",
                }}
              >
                Configure two-factor authentication settings
              </Typography>

              <Typography
                sx={{
                  color: "#22394C",
                  fontFamily: "Lufga",
                  fontSize: "13px",
                  fontWeight: 500,
                  fontStyle: "medium",
                }}
              >
                Require Duo for all employees Enable two-factor authentication
                for enhanced security
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={handleConfigureDuo}
            variant="outlined"
            sx={{
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 600,
              fontFamily: "gilroy",
              fontSize: "13px",
              px: 2.5,
              py: 0.7,
              color: "#2B7A9B",
              borderColor: "#2B7A9B",
              boxShadow: "none",
              whiteSpace: "nowrap",
              "&:hover": {
                borderColor: "#236485",
                bgcolor: "rgba(43, 122, 155, 0.04)",
                boxShadow: "none",
              },
            }}
          >
            Configure
          </Button>
        </Box>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
