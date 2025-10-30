import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
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
  Dashboard as DashboardIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Business as CompaniesIcon,
  MoreHoriz as MoreHorizIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { getRequestList, rejectCompany } from "../Api/api";

const DashboardOverview = () => {
  const [companyProgress, setCompanyProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Reject Dialog States
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [rejecting, setRejecting] = useState(false);
  const [rejectMessage, setRejectMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchRequestList();
  }, []);

  const fetchRequestList = async () => {
    try {
      const response = await getRequestList();

      const formattedData =
        response?.data?.users?.map((item) => ({
          id: item.id || "N/A",
          company: item.company_name || "Unknown Company",
          email: item.email || "-",
          employees: item.no_of_employees || 0,
          status: item.status || "Pending",
          startDate: item.created_at
            ? new Date(item.created_at).toLocaleDateString()
            : "-",
          endDate: "-",
        })) || [];

      setCompanyProgress(formattedData);

      setStats({
        pending: response?.data?.pending_count || 0,
        approved: response?.data?.approved_count || 0,
        rejected: response?.data?.reject_count || 0,
      });
    } catch (error) {
      console.error("Error fetching request list:", error);
      setCompanyProgress([]);
      setStats({ pending: 0, approved: 0, rejected: 0 });
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
          fetchRequestList();
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

  const statsCards = [
    {
      title: "Pending Requests",
      value: stats.pending,
      subtitle: "Awaiting review",
      icon: <PendingIcon />,
      iconBg: "#E3F2FD",
      iconColor: "#2196F3",
    },
    {
      title: "Approved",
      value: stats.approved,
      subtitle: "Finished training",
      icon: <ApprovedIcon />,
      iconBg: "#E8F5E9",
      iconColor: "#4CAF50",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      subtitle: "Total rejected requests",
      icon: <RejectedIcon />,
      iconBg: "#FFEBEE",
      iconColor: "#F44336",
    },
    {
      title: "Active Companies",
      value: companyProgress.length,
      subtitle: "Recently onboarded",
      icon: <CompaniesIcon />,
      iconBg: "#E8F4F8",
      iconColor: "#5B9FBD",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#EFF4F7", minHeight: "100vh", p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box
            sx={{
              bgcolor: "#5B9FBD",
              borderRadius: "12px",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DashboardIcon sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#262A41",
                fontWeight: 500,
                fontSize: "30px",
                fontFamily: "Lufga",
              }}
            >
              Dashboard
            </Typography>
            <Typography
              sx={{
                color: "#64748B",
                fontSize: "16px",
                fontFamily: "Lufga",
              }}
            >
              Manage company admin requests and monitor system activity
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2.5,
          mb: 3,
          flexWrap: "nowrap",
        }}
      >
        {statsCards.map((card, index) => (
          <Card
            key={index}
            sx={{
              flex: 1, // ensures equal width
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e8eef2",
              bgcolor: "#fff",
              height: 200, // fixed equal height
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                color: "#b5c4cd",
                "&:hover": { bgcolor: "#f5f8fa" },
              }}
            >
              <MoreHorizIcon fontSize="small" />
            </IconButton>

            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Box
                  sx={{
                    bgcolor: card.iconBg,
                    borderRadius: "10px",
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {React.cloneElement(card.icon, {
                    sx: { color: card.iconColor, fontSize: 24 },
                  })}
                </Box>
                <Typography
                  sx={{
                    color: "#22394C",
                    fontSize: "16px",
                    fontWeight: 700,
                    fontFamily: "Lufga",
                  }}
                >
                  {card.title}
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "#22394C",
                  fontWeight: 600,
                  fontSize: "44px",
                  fontFamily: "Lufga",
                  lineHeight: 1,
                }}
              >
                {card.value}
              </Typography>
              <Typography
                sx={{
                  color: "#22394C",
                  fontSize: "14px",
                  mt: 1,
                  fontFamily: "Lufga",
                }}
              >
                {card.subtitle}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Recent Company Progress Table */}
      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e8eef2",
          bgcolor: "#fff",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 2 }}>
            <Typography
              sx={{
                color: "#262A41",
                fontWeight: 600,
                fontSize: "19px",
                fontFamily: "Lufga",
              }}
            >
              Recent Company Progress
            </Typography>
            <Typography
              sx={{
                color: "#22394C",
                fontSize: "14px",
                fontFamily: "Lufga",
              }}
            >
              Latest updates from your team
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#F8FAFB" }}>
                    {[
                      "Request ID",
                      "Company Name",
                      "Email",
                      "No of Employees",
                      "Status",
                      "Start Date",
                      "End Date",
                      "Action",
                    ].map((head, idx) => (
                      <TableCell
                        key={idx}
                        sx={{
                          color: "#22394CE5",
                          fontSize: "15px",
                          fontFamily: "Lufga",
                          fontWeight: 500,
                          border: "none",
                        }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companyProgress.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": { bgcolor: "#f8fbfd" },
                        borderBottom: "1px solid #e8eef2",
                      }}
                    >
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.company}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.employees}</TableCell>
                      <TableCell>
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
                            height: "26px",
                            fontWeight: 600,
                            borderRadius: "6px",
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.startDate}</TableCell>
                      <TableCell>{row.endDate}</TableCell>
                      <TableCell>
                        <IconButton
                          sx={{ color: "#F44336" }}
                          size="small"
                          onClick={() => handleOpenRejectDialog(row)}
                          disabled={row.status === "rejected"}
                        >
                          <EditIcon fontSize="small" />
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
            borderRadius: "16px",
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
              fontFamily: "Lufga",
              fontSize: "20px",
              fontWeight: 600,
              color: "#262A41",
            }}
          >
            Reject Company Request
          </Typography>
          <IconButton
            onClick={handleCloseRejectDialog}
            size="small"
            sx={{ color: "#64748B" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {rejectMessage.text && (
            <Alert
              severity={rejectMessage.type}
              sx={{ mb: 2, fontFamily: "Lufga" }}
            >
              {rejectMessage.text}
            </Alert>
          )}

          <Box
            sx={{
              bgcolor: "#FFF8E1",
              borderRadius: "12px",
              p: 2.5,
              mb: 2,
              border: "1px solid #FFE082",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Lufga",
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
                fontFamily: "Lufga",
                fontSize: "14px",
                color: "#22394C",
              }}
            >
              Are you sure you want to reject the company request for:
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "#F8FAFB",
              borderRadius: "12px",
              p: 2.5,
              border: "1px solid #E8EEF2",
            }}
          >
            <Box sx={{ mb: 1.5 }}>
              <Typography
                sx={{
                  fontFamily: "Lufga",
                  fontSize: "12px",
                  color: "#64748B",
                  mb: 0.5,
                }}
              >
                Company Name
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lufga",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#262A41",
                }}
              >
                {selectedCompany?.company}
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: "Lufga",
                  fontSize: "12px",
                  color: "#64748B",
                  mb: 0.5,
                }}
              >
                Email Address
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lufga",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#262A41",
                }}
              >
                {selectedCompany?.email}
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              fontFamily: "Lufga",
              fontSize: "13px",
              color: "#64748B",
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
              fontFamily: "Lufga",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 600,
              color: "#64748B",
              px: 3,
              py: 1,
              borderRadius: "8px",
              "&:hover": {
                bgcolor: "#F8FAFB",
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
              fontFamily: "Lufga",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 600,
              bgcolor: "#F44336",
              color: "#fff",
              px: 3,
              py: 1,
              borderRadius: "8px",
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

export default DashboardOverview;
