import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Collapse,
  Divider,
} from "@mui/material";
import {
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getCompanyEmployeeList,
  getUserAnswers,
  uploadCertificate,
} from "../Api/api";

const TestResultsManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [openAnswersDialog, setOpenAnswersDialog] = useState(false);
  const [openCertificateDialog, setOpenCertificateDialog] = useState(false);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [certificateFile, setCertificateFile] = useState(null);
  const [certificateFileName, setCertificateFileName] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    fetchCompanies();
  }, []);

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await getCompanyEmployeeList();

      if (response.code === "200") {
        setCompanies(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch companies");
        setCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAnswers = async (userId) => {
    setLoadingAnswers(true);
    try {
      const response = await getUserAnswers(userId);

      if (response.code === "200") {
        setUserAnswers(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch user answers");
        setUserAnswers([]);
      }
    } catch (error) {
      console.error("Error fetching user answers:", error);
      toast.error("Failed to load user answers");
      setUserAnswers([]);
    } finally {
      setLoadingAnswers(false);
    }
  };

  const handleViewAnswers = async (company) => {
    setSelectedUser({
      id: company.id,
      first_name: company.first_name || "",
      last_name: company.last_name || "",
      email: company.email,
      company_name: company.company_name,
      course_id: company.course_id,
    });
    setOpenAnswersDialog(true);
    await fetchUserAnswers(company.id);
  };

  const handleCloseAnswersDialog = () => {
    setOpenAnswersDialog(false);
    setSelectedUser(null);
    setUserAnswers([]);
    setExpandedQuestions({});
  };

  const handleOpenCertificateDialog = (company) => {
    setSelectedUser({
      id: company.id,
      first_name: company.first_name || "",
      last_name: company.last_name || "",
      email: company.email,
      company_name: company.company_name,
      course_id: company.course_id,
    });
    setOpenCertificateDialog(true);
  };

  const handleCloseCertificateDialog = () => {
    setOpenCertificateDialog(false);
    setSelectedUser(null);
    setCertificateFile(null);
    setCertificateFileName("");
  };

  const handleCertificateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        return;
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error("File size should not exceed 10MB");
        return;
      }

      setCertificateFile(file);
      setCertificateFileName(file.name);
    }
  };

  const handleUploadCertificate = async () => {
    if (!certificateFile) {
      toast.error("Please select a PDF file");
      return;
    }

    if (!selectedUser) {
      toast.error("User not selected");
      return;
    }

    setUploadingCertificate(true);
    try {
      const formData = new FormData();
      formData.append("pdf_file", certificateFile);
      formData.append("user", selectedUser.id);
      formData.append("course", selectedUser.course_id);

      const response = await uploadCertificate(formData);

      if (response.code === "200") {
        toast.success(response.message || "Certificate uploaded successfully!");
        handleCloseCertificateDialog();
      } else {
        toast.error(response.message || "Failed to upload certificate");
      }
    } catch (error) {
      console.error("Error uploading certificate:", error);
      toast.error("Failed to upload certificate");
    } finally {
      setUploadingCertificate(false);
    }
  };

  // Modified: Calculate overall score across ALL answers
  const calculateOverallScore = (answers) => {
    if (!answers || answers.length === 0) return { correct: 0, total: 0, percentage: 0 };
    
    // Count all correct answers regardless of course
    const correct = answers.filter((ans) => ans.isCorrect === true).length;
    const total = answers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    return { correct, total, percentage };
  };

  // New: Get course breakdown for display
  const getCourseBreakdown = (answers) => {
    if (!answers || answers.length === 0) return [];
    
    const courseMap = new Map();
    
    answers.forEach(answer => {
      const courseName = answer.course_name || "Unknown Course";
      if (!courseMap.has(courseName)) {
        courseMap.set(courseName, {
          name: courseName,
          correct: 0,
          total: 0,
        });
      }
      
      const course = courseMap.get(courseName);
      course.total++;
      if (answer.isCorrect === true) {
        course.correct++;
      }
    });
    
    return Array.from(courseMap.values()).map(course => ({
      ...course,
      percentage: Math.round((course.correct / course.total) * 100)
    }));
  };

  const getTotalEmployees = () => {
    return companies.reduce((total, company) => total + (company.no_of_employees || 0), 0);
  };

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", p: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                bgcolor: "#5B9FBD",
                borderRadius: "8px",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AssessmentIcon sx={{ color: "#fff", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: "#1a3a4a",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
              >
                Test Results Management
              </Typography>
              <Typography
                sx={{
                  color: "#8b9ba5",
                  fontSize: "13px",
                }}
              >
                View and manage employee test submissions
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Companies List */}
      <Box sx={{ mb: 2 }}>
        <Typography
          sx={{ fontWeight: 600, color: "#1a3a4a", fontSize: "16px", mb: 2 }}
        >
          Companies & Employee Test Results
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress sx={{ color: "#5B9FBD" }} />
          </Box>
        ) : companies.length === 0 ? (
          <Card
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: "12px",
              border: "1px solid #e8eef2",
              boxShadow: "none",
            }}
          >
            <BusinessIcon sx={{ fontSize: 64, color: "#e8eef2", mb: 2 }} />
            <Typography sx={{ color: "#8b9ba5", fontWeight: 600, mb: 1 }}>
              No Companies Found
            </Typography>
            <Typography sx={{ color: "#8b9ba5", fontSize: "14px" }}>
              No test submissions available yet
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {companies.map((company) => (
              <Card
                key={company.id}
                sx={{
                  borderRadius: "12px",
                  border: "1px solid #e8eef2",
                  boxShadow: "none",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: "#fff",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", md: "center" },
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: "#5B9FBD",
                        width: 48,
                        height: 48,
                      }}
                    >
                      <BusinessIcon />
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          color: "#1a3a4a",
                          fontWeight: 700,
                          fontSize: "16px",
                        }}
                      >
                        {[
                          company?.company_name,
                          [company?.first_name, company?.last_name].filter(Boolean).join(" ")
                        ]
                          .filter(Boolean)
                          .join(" || ")}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#8b9ba5",
                          fontSize: "13px",
                        }}
                      >
                        {company.email} • <strong style={{ color: "#5B9FBD", textTransform: "capitalize" }}>{company.type}</strong>
                      </Typography>
                    </Box>
                  </Box>
                  <Box 
                    sx={{ 
                      display: "flex", 
                      gap: 2,
                      flexDirection: { xs: "column", sm: "row" },
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<AssessmentIcon />}
                      onClick={() => handleViewAnswers(company)}
                      fullWidth
                      sx={{
                        bgcolor: "#5B9FBD",
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "8px",
                        border: "none",
                        "&:hover": {
                          bgcolor: "#4a8a9f",
                        },
                      }}
                    >
                      View Test Results
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      onClick={() => handleOpenCertificateDialog(company)}
                      fullWidth
                      sx={{
                        bgcolor: "#9C27B0",
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "8px",
                        border: "none",
                        "&:hover": {
                          bgcolor: "#7B1FA2",
                        },
                      }}
                    >
                      Upload Certificate
                    </Button>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* View Answers Dialog */}
      <Dialog
        open={openAnswersDialog}
        onClose={handleCloseAnswersDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px" },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#1a3a4a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e8eef2",
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "18px" }}>
              Overall Test Results: {selectedUser?.first_name} {selectedUser?.last_name}
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#8b9ba5", mt: 0.5 }}>
              {selectedUser?.company_name} • {selectedUser?.email}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseAnswersDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {loadingAnswers ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 5,
              }}
            >
              <CircularProgress sx={{ color: "#5B9FBD" }} />
            </Box>
          ) : userAnswers.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <AssessmentIcon sx={{ fontSize: 64, color: "#e8eef2", mb: 2 }} />
              <Typography sx={{ color: "#8b9ba5", fontWeight: 600 }}>
                No test results found
              </Typography>
            </Box>
          ) : (
            <>
              {/* Overall Score Summary */}
              <Card
                sx={{
                  mb: 3,
                  borderRadius: "12px",
                  bgcolor: "#f8fbfd",
                  border: "1px solid #e8eef2",
                  boxShadow: "none",
                }}
              >
                <CardContent>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#1a3a4a",
                      mb: 2,
                      textAlign: "center",
                    }}
                  >
                    Overall Performance Across All Courses
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "32px",
                          fontWeight: 700,
                          color: "#4CAF50",
                        }}
                      >
                        {calculateOverallScore(userAnswers).correct}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "13px", color: "#8b9ba5", mt: 0.5 }}
                      >
                        Correct Answers
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "32px",
                          fontWeight: 700,
                          color: "#f44336",
                        }}
                      >
                        {calculateOverallScore(userAnswers).total -
                          calculateOverallScore(userAnswers).correct}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "13px", color: "#8b9ba5", mt: 0.5 }}
                      >
                        Wrong Answers
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "32px",
                          fontWeight: 700,
                          color: "#5B9FBD",
                        }}
                      >
                        {calculateOverallScore(userAnswers).percentage}%
                      </Typography>
                      <Typography
                        sx={{ fontSize: "13px", color: "#8b9ba5", mt: 0.5 }}
                      >
                        Overall Score
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "32px",
                          fontWeight: 700,
                          color: "#FF9800",
                        }}
                      >
                        {calculateOverallScore(userAnswers).total}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "13px", color: "#8b9ba5", mt: 0.5 }}
                      >
                        Total Questions
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Course-wise Breakdown */}
              {getCourseBreakdown(userAnswers).length > 1 && (
                <Card
                  sx={{
                    mb: 3,
                    borderRadius: "12px",
                    bgcolor: "#fff",
                    border: "1px solid #e8eef2",
                    boxShadow: "none",
                  }}
                >
                  <CardContent>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#1a3a4a",
                        mb: 2,
                      }}
                    >
                      Course-wise Breakdown
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      {getCourseBreakdown(userAnswers).map((course, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 2,
                            bgcolor: "#f8fbfd",
                            borderRadius: "8px",
                            border: "1px solid #e8eef2",
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#1a3a4a",
                                mb: 0.5,
                              }}
                            >
                              {course.name}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "12px",
                                color: "#8b9ba5",
                              }}
                            >
                              {course.correct} / {course.total} correct
                            </Typography>
                          </Box>
                          <Chip
                            label={`${course.percentage}%`}
                            sx={{
                              bgcolor: course.percentage >= 70 ? "#E8F5E9" : course.percentage >= 50 ? "#FFF3E0" : "#FFEBEE",
                              color: course.percentage >= 70 ? "#4CAF50" : course.percentage >= 50 ? "#FF9800" : "#f44336",
                              fontWeight: 700,
                              fontSize: "13px",
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Questions and Answers */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {userAnswers.map((answer, index) => {
                  const isExpanded = expandedQuestions[index] || false;
                  
                  return (
                    <Card
                      key={index}
                      sx={{
                        borderRadius: "12px",
                        border: answer.isCorrect
                          ? "2px solid #4CAF50"
                          : "2px solid #f44336",
                        boxShadow: "none",
                        bgcolor: "#fff",
                      }}
                    >
                      {/* Question Header - Always Visible */}
                      <Box
                        sx={{
                          p: 2.5,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "#f8fbfd" },
                        }}
                        onClick={() => toggleQuestion(index)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "start",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor: answer.isCorrect ? "#4CAF50" : "#f44336",
                              borderRadius: "50%",
                              width: 36,
                              height: 36,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#fff",
                                fontSize: "16px",
                                fontWeight: 700,
                              }}
                            >
                              {index + 1}
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                              <Chip
                                label={answer.course_name}
                                size="small"
                                sx={{
                                  bgcolor: "#E8F4F8",
                                  color: "#5B9FBD",
                                  fontWeight: 600,
                                  fontSize: "11px",
                                }}
                              />
                              <Chip
                                icon={answer.isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                                label={answer.isCorrect ? "Correct" : "Incorrect"}
                                size="small"
                                sx={{
                                  bgcolor: answer.isCorrect ? "#E8F5E9" : "#FFEBEE",
                                  color: answer.isCorrect ? "#4CAF50" : "#f44336",
                                  fontWeight: 700,
                                  fontSize: "12px",
                                  border: `1px solid ${answer.isCorrect ? "#4CAF50" : "#f44336"}`,
                                }}
                              />
                            </Box>
                            <Typography
                              sx={{
                                color: "#1a3a4a",
                                fontWeight: 600,
                                fontSize: "16px",
                                lineHeight: 1.6,
                              }}
                            >
                              {answer.question_text}
                            </Typography>
                          </Box>
                          <IconButton size="small">
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Expandable Content */}
                      <Collapse in={isExpanded}>
                        <CardContent sx={{ pt: 0, pb: 2.5, px: 2.5 }}>
                          {/* All Options */}
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            {answer.options?.map((option, optIdx) => {
                              const isUserAnswer = option.text === answer.userAnswer || 
                                                   option.text.trim() === answer.userAnswer?.trim();
                              const isCorrectAnswer = option.is_correct === true;

                              let borderColor = "#e0e0e0";
                              let bgcolor = "#fff";
                              let textColor = "#262A41";
                              let icon = null;
                              let fontWeight = 400;

                              if (isCorrectAnswer) {
                                borderColor = "#4CAF50";
                                bgcolor = "#E8F5E9";
                                textColor = "#2E7D32";
                                icon = "✓";
                                fontWeight = 600;
                              } else if (isUserAnswer && !answer.isCorrect) {
                                borderColor = "#f44336";
                                bgcolor = "#FFEBEE";
                                textColor = "#C62828";
                                icon = "✗";
                                fontWeight = 600;
                              }

                              return (
                                <Box
                                  key={optIdx}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    p: 2,
                                    borderRadius: "8px",
                                    border: `2px solid ${borderColor}`,
                                    bgcolor: bgcolor,
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: "50%",
                                      bgcolor: isCorrectAnswer
                                        ? "#4CAF50"
                                        : isUserAnswer
                                        ? "#f44336"
                                        : "#E8F4F8",
                                      color: isCorrectAnswer || isUserAnswer ? "#fff" : "#5B9FBD",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: 700,
                                      fontSize: "14px",
                                      flexShrink: 0,
                                    }}
                                  >
                                    {String.fromCharCode(65 + optIdx)}
                                  </Box>

                                  <Typography
                                    sx={{
                                      flex: 1,
                                      fontSize: "15px",
                                      fontWeight: fontWeight,
                                      color: textColor,
                                    }}
                                  >
                                    {option.text}
                                  </Typography>

                                  {icon && (
                                    <Box
                                      sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        bgcolor: isCorrectAnswer ? "#4CAF50" : "#f44336",
                                        color: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 700,
                                        fontSize: "16px",
                                      }}
                                    >
                                      {icon}
                                    </Box>
                                  )}
                                </Box>
                              );
                            })}
                          </Box>

                          {/* Explanation Labels - Only show when answer is wrong */}
                          {!answer.isCorrect && (
                            <Box
                              sx={{
                                mt: 2,
                                pt: 2,
                                borderTop: "1px dashed #e0e0e0",
                                display: "flex",
                                gap: 3,
                                flexWrap: "wrap",
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    bgcolor: "#f44336",
                                  }}
                                />
                                <Typography sx={{ fontSize: "12px", color: "#64748B" }}>
                                  Your Answer
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    bgcolor: "#4CAF50",
                                  }}
                                />
                                <Typography sx={{ fontSize: "12px", color: "#64748B" }}>
                                  Correct Answer
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </CardContent>
                      </Collapse>
                    </Card>
                  );
                })}
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2, borderTop: "1px solid #e8eef2" }}>
          <Button
            onClick={handleCloseAnswersDialog}
            variant="contained"
            sx={{
              bgcolor: "#5B9FBD",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              border: "none",
              "&:hover": {
                bgcolor: "#4a8a9f",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Certificate Dialog */}
      <Dialog
        open={openCertificateDialog}
        onClose={handleCloseCertificateDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px" },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#1a3a4a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e8eef2",
          }}
        >
          Upload Certificate
          <IconButton onClick={handleCloseCertificateDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: "16px", color: "#1a3a4a", fontWeight: 600 }}>
              {selectedUser?.first_name} {selectedUser?.last_name}
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#8b9ba5" }}>
              {selectedUser?.company_name} • {selectedUser?.email}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <input
              accept="application/pdf"
              style={{ display: "none" }}
              id="certificate-upload"
              type="file"
              onChange={handleCertificateUpload}
            />
            <label htmlFor="certificate-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{
                  borderColor: "#5B9FBD",
                  color: "#5B9FBD",
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: "8px",
                  "&:hover": {
                    borderColor: "#4a8a9f",
                    bgcolor: "#f8fbfd",
                  },
                }}
              >
                {certificateFileName || "Select PDF Certificate"}
              </Button>
            </label>
            {certificateFileName && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "#f8fbfd",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <DownloadIcon sx={{ color: "#5B9FBD", fontSize: 20 }} />
                <Typography sx={{ fontSize: "13px", color: "#1a3a4a", flex: 1 }}>
                  {certificateFileName}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    setCertificateFile(null);
                    setCertificateFileName("");
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2, borderTop: "1px solid #e8eef2" }}>
          <Button
            onClick={handleCloseCertificateDialog}
            sx={{ 
              textTransform: "none", 
              color: "#8b9ba5",
              "&:hover": {
                bgcolor: "#f5f7fa",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUploadCertificate}
            variant="contained"
            disabled={uploadingCertificate || !certificateFile}
            sx={{
              bgcolor: "#9C27B0",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              border: "none",
              "&:hover": {
                bgcolor: "#7B1FA2",
              },
              "&:disabled": {
                bgcolor: "#e8eef2",
                color: "#8b9ba5",
              },
            }}
          >
            {uploadingCertificate ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              "Upload Certificate"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestResultsManagement;