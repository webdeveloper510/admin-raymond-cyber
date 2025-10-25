import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { getRequestList, rejectCompany } from "../Api/api";

const CompanyAdminRequests = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [companyRequests, setCompanyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reject Dialog States
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [rejecting, setRejecting] = useState(false);
  const [rejectMessage, setRejectMessage] = useState({ type: "", text: "" });

  const tabs = [
    { id: "all", label: "All Requests" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getRequestList();
      const users = response?.data?.users || [];
      const formattedData = users.map((item) => ({
        id: `REQ-${item.id}`,
        company: item.company_name,
        email: item.email,
        requestDate: item.created_at
          ? new Date(item.created_at).toLocaleDateString()
          : "-",
        status: item.status.toLowerCase(),
      }));
      setCompanyRequests(formattedData);
    } catch (error) {
      console.error("Error fetching company requests:", error);
      setCompanyRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRejectDialog = (company) => {
    setSelectedCompany(company);
    setOpenRejectDialog(true);
    setRejectMessage({ type: "", text: "" });
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setSelectedCompany(null);
    setRejectMessage({ type: "", text: "" });
  };

  const handleRejectCompany = async () => {
    if (!selectedCompany?.email) return;

    setRejecting(true);
    setRejectMessage({ type: "", text: "" });

    try {
      const response = await rejectCompany(selectedCompany.email);

      if (response.success || response.message?.includes("success")) {
        setRejectMessage({
          type: "success",
          text: "Company rejected successfully!",
        });

        // Refresh the list after 1.5 seconds
        setTimeout(() => {
          fetchRequests();
          handleCloseRejectDialog();
        }, 1500);
      } else {
        setRejectMessage({
          type: "error",
          text: response.message || "Failed to reject company.",
        });
      }
    } catch (error) {
      setRejectMessage({
        type: "error",
        text: "An error occurred while rejecting the company.",
      });
    } finally {
      setRejecting(false);
    }
  };

  const filteredRequests =
    activeTab === "all"
      ? companyRequests
      : companyRequests.filter((req) => req.status === activeTab);

  return (
    <Box sx={{ bgcolor: "#E8ECEF", minHeight: "100vh", p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              bgcolor: "#6BA5C1",
              borderRadius: "10px",
              width: 52,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BusinessIcon sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              sx={{ color: "#2D3748", fontWeight: 600, fontSize: "24px", mb: 0.3 }}
            >
              Company Admin Requests
            </Typography>
            <Typography sx={{ color: "#718096", fontSize: "14px" }}>
              Review and manage company admin requests
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Card
        sx={{
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E2E8F0",
          bgcolor: "#fff",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 0, px: 2 }}>
          {tabs.map((tab) => (
            <Box
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              sx={{
                py: 2,
                px: 3,
                cursor: "pointer",
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid #5BA3C5"
                    : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <Typography
                sx={{
                  color: activeTab === tab.id ? "#5BA3C5" : "#718096",
                  fontSize: "14px",
                  fontWeight: activeTab === tab.id ? 600 : 500,
                }}
              >
                {tab.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>

      {/* Table */}
      <Card
        sx={{
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E2E8F0",
          bgcolor: "#fff",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#F7FAFC" }}>
                    {[
                      "Request ID",
                      "Company Name",
                      "Email",
                      "Request date",
                      "Status",
                      "Action",
                    ].map((head, idx) => (
                      <TableCell
                        key={idx}
                        sx={{
                          color: "#4A5568",
                          fontSize: "13px",
                          fontWeight: 600,
                          borderBottom: "1px solid #E2E8F0",
                          py: 2,
                          px: 3,
                        }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRequests.map((row, index) => (
                    <TableRow key={index} sx={{ "&:hover": { bgcolor: "#F7FAFC" } }}>
                      <TableCell
                        sx={{
                          color: "#2D3748",
                          fontSize: "14px",
                          fontWeight: 400,
                          borderBottom:
                            index === filteredRequests.length - 1
                              ? "none"
                              : "1px solid #E2E8F0",
                          py: 2.5,
                          px: 3,
                        }}
                      >
                        {row.id}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#2D3748",
                          fontSize: "14px",
                          fontWeight: 400,
                          borderBottom:
                            index === filteredRequests.length - 1
                              ? "none"
                              : "1px solid #E2E8F0",
                          py: 2.5,
                          px: 3,
                        }}
                      >
                        {row.company}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#2D3748",
                          fontSize: "14px",
                          fontWeight: 400,
                          borderBottom:
                            index === filteredRequests.length - 1
                              ? "none"
                              : "1px solid #E2E8F0",
                          py: 2.5,
                          px: 3,
                        }}
                      >
                        {row.email}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#2D3748",
                          fontSize: "14px",
                          fontWeight: 400,
                          borderBottom:
                            index === filteredRequests.length - 1
                              ? "none"
                              : "1px solid #E2E8F0",
                          py: 2.5,
                          px: 3,
                        }}
                      >
                        {row.requestDate}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom:
                            index === filteredRequests.length - 1
                              ? "none"
                              : "1px solid #E2E8F0",
                          py: 2.5,
                          px: 3,
                        }}
                      >
                        <Chip
                          label={row.status}
                          sx={{
                            bgcolor:
                              row.status === "approved"
                                ? "#E8F5E9"
                                : row.status === "rejected"
                                ? "#FFEBEE"
                                : "#FFF8E1",
                            color:
                              row.status === "approved"
                                ? "#4CAF50"
                                : row.status === "rejected"
                                ? "#F44336"
                                : "#FF9800",
                            fontSize: "12px",
                            height: "24px",
                            fontWeight: 600,
                            borderRadius: "4px",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom:
                            index === filteredRequests.length - 1
                              ? "none"
                              : "1px solid #E2E8F0",
                          py: 2.5,
                          px: 3,
                        }}
                      >
                        <IconButton
                          sx={{
                            color: "#F44336",
                            "&:hover": { bgcolor: "#FFEBEE" },
                            p: 0.5,
                          }}
                          size="small"
                          onClick={() => handleOpenRejectDialog(row)}
                          disabled={row.status === "rejected"}
                        >
                          <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Reject Company Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#2D3748",
            }}
          >
            Reject Company Request
          </Typography>
          <IconButton
            onClick={handleCloseRejectDialog}
            size="small"
            sx={{ color: "#718096" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {rejectMessage.text && (
            <Alert severity={rejectMessage.type} sx={{ mb: 2 }}>
              {rejectMessage.text}
            </Alert>
          )}

          <Box
            sx={{
              bgcolor: "#FFF8E1",
              borderRadius: "8px",
              p: 2.5,
              mb: 2,
              border: "1px solid #FFE082",
            }}
          >
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#F57C00",
                mb: 1,
              }}
            >
              ⚠️ Confirmation Required
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#2D3748",
              }}
            >
              Are you sure you want to reject the company request for:
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "#F7FAFC",
              borderRadius: "8px",
              p: 2.5,
              border: "1px solid #E2E8F0",
            }}
          >
            <Box sx={{ mb: 1.5 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#718096",
                  mb: 0.5,
                }}
              >
                Company Name
              </Typography>
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#2D3748",
                }}
              >
                {selectedCompany?.company}
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#718096",
                  mb: 0.5,
                }}
              >
                Email Address
              </Typography>
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#2D3748",
                }}
              >
                {selectedCompany?.email}
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: "13px",
              color: "#718096",
              mt: 2,
              fontStyle: "italic",
            }}
          >
            This action cannot be undone. The company will be notified of the
            rejection.
          </Typography>
        </DialogContent>
            
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button
            onClick={handleCloseRejectDialog}
            disabled={rejecting}
            sx={{
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 600,
              color: "#718096",
              px: 3,
              py: 1,
              borderRadius: "6px",
              "&:hover": {
                bgcolor: "#F7FAFC",
              },
            }}
          >
            Cancel  
          </Button>
          <Button
            onClick={handleRejectCompany}
            disabled={rejecting}
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 600,
              bgcolor: "#F44336",
              color: "#fff",
              px: 3,
              py: 1,
              borderRadius: "6px",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#D32F2F",
                boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
              },
              "&:disabled": {
                bgcolor: "#FFCDD2",
                color: "#fff",
              },
            }}
          >
            {rejecting ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: "#fff" }} />
                Rejecting...
              </>
            ) : (
              "Reject Company"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyAdminRequests;