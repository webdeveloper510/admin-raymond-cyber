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
  TextField,
  Chip,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  VideoLibrary as VideoLibraryIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayCircle as PlayCircleIcon,
  MoreHoriz as MoreHorizIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addVideo,
  getVideoList,
  deleteVideo,
  createQuestion,
  getCourseList,
  addCourse,
  editCourse,
  deleteCourse,
  getCompletedVideoQuestions,
} from "../Api/api";

const VideoManagement = () => {
  // Course States
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  console.log("🚀 ~ VideoManagement ~ selectedCourse:", selectedCourse);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [openDeleteCourseDialog, setOpenDeleteCourseDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [editCourseMode, setEditCourseMode] = useState(false);
  const [savingCourse, setSavingCourse] = useState(false);
  const [courseMenuAnchor, setCourseMenuAnchor] = useState(null);
  const [selectedCourseForMenu, setSelectedCourseForMenu] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    id: null,
    course_name: "",
    description: "",
  });

  // Video States
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [thumbnails, setThumbnails] = useState({});
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [selectedCourseForQuestion, setSelectedCourseForQuestion] =
    useState(null);
  const [questionData, setQuestionData] = useState({
    text: "",
    options: [
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ],
  });
  // Question List States
  const [openQuestionListDialog, setOpenQuestionListDialog] = useState(false);
  const [questionsList, setQuestionsList] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [selectedCourseForQuestionList, setSelectedCourseForQuestionList] =
    useState(null);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoFile: null,
    videoFileName: "",
    is_course_video_upload_completed: false,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchVideos();
    }
  }, [selectedCourse]);

  // ==================== COURSE FUNCTIONS ====================

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await getCourseList();

      if (response.code === "200") {
        const coursesList = response.data || [];
        setCourses(coursesList);

        if (coursesList.length > 0 && !selectedCourse) {
          setSelectedCourse(coursesList[0]);
        }
      } else {
        toast.error(response.message || "Failed to fetch courses");
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };
  const handleOpenQuestionListDialog = async (course) => {
    setSelectedCourseForQuestionList(course);
    setOpenQuestionListDialog(true);
    fetchQuestionsList(course.id);
  };

  const handleCloseQuestionListDialog = () => {
    setOpenQuestionListDialog(false);
    setSelectedCourseForQuestionList(null);
    setQuestionsList([]);
  };

  const fetchQuestionsList = async (courseId) => {
    setLoadingQuestions(true);
    try {
      const response = await getCompletedVideoQuestions(courseId);
      if (response.code === "200") {
        setQuestionsList(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch questions");
        setQuestionsList([]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions");
      setQuestionsList([]);
    } finally {
      setLoadingQuestions(false);
    }
  };
  const handleOpenCourseDialog = (course = null) => {
    if (course) {
      setEditCourseMode(true);
      setCourseFormData({
        id: course.id,
        course_name: course.course_name,
        description: course.description || "",
      });
    } else {
      setEditCourseMode(false);
      setCourseFormData({
        id: null,
        course_name: "",
        description: "",
      });
    }
    setOpenCourseDialog(true);
    handleCloseCourseMenu();
  };

  const handleCloseCourseDialog = () => {
    setOpenCourseDialog(false);
    setEditCourseMode(false);
    setCourseFormData({
      id: null,
      course_name: "",
      description: "",
    });
  };

  const handleCourseInputChange = (e) => {
    setCourseFormData({
      ...courseFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitCourse = async () => {
    if (!courseFormData.course_name.trim()) {
      toast.error("Please enter a course name");
      return;
    }

    setSavingCourse(true);
    try {
      let response;

      if (editCourseMode) {
        response = await editCourse(courseFormData.id, {
          course_name: courseFormData.course_name,
          description: courseFormData.description,
        });
      } else {
        response = await addCourse({
          course_name: courseFormData.course_name,
          description: courseFormData.description,
        });
      }

      if (response.code === "200") {
        toast.success(
          response.message ||
            (editCourseMode
              ? "Course updated successfully!"
              : "Course added successfully!")
        );
        handleCloseCourseDialog();
        fetchCourses();
      } else {
        toast.error(response.message || "Failed to save course");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Failed to save course");
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setOpenDeleteCourseDialog(true);
    handleCloseCourseMenu();
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      const response = await deleteCourse(courseToDelete.id);

      if (response.code === "200") {
        toast.success("Training Module deleted successfully!");
        setCourses(courses.filter((course) => course.id !== courseToDelete.id));

        if (selectedCourse?.id === courseToDelete.id) {
          setSelectedCourse(courses.length > 1 ? courses[0] : null);
        }
      } else {
        toast.error(response.message || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    } finally {
      setOpenDeleteCourseDialog(false);
      setCourseToDelete(null);
    }
  };

  const handleCloseDeleteCourseDialog = () => {
    setOpenDeleteCourseDialog(false);
    setCourseToDelete(null);
  };

  const handleOpenCourseMenu = (event, course) => {
    setCourseMenuAnchor(event.currentTarget);
    setSelectedCourseForMenu(course);
  };

  const handleCloseCourseMenu = () => {
    setCourseMenuAnchor(null);
    setSelectedCourseForMenu(null);
  };

  const getTotalVideos = () => {
    return courses.reduce(
      (total, course) => total + (course.video_count || 0),
      0
    );
  };

  // ==================== VIDEO FUNCTIONS ====================

  const generateThumbnail = (videoUrl, videoId) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.preload = "metadata";
      video.src = videoUrl;

      video.onloadedmetadata = () => {
        video.currentTime = Math.min(2, video.duration * 0.1);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
          resolve(thumbnailUrl);
        } catch (error) {
          console.error("Error generating thumbnail:", error);
          reject(error);
        } finally {
          video.remove();
        }
      };

      video.onerror = (error) => {
        console.error("Error loading video for thumbnail:", error);
        video.remove();
        reject(error);
      };
    });
  };

  const handleOpenQuestionDialog = (course) => {
    setSelectedCourseForQuestion(course);
    setOpenQuestionDialog(true);
  };

  const handleCloseQuestionDialog = () => {
    setOpenQuestionDialog(false);
    setSelectedCourseForQuestion(null);
    setQuestionData({
      text: "",
      options: [
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ],
    });
  };

  const generateThumbnailsForVideos = async (videoList) => {
    const newThumbnails = {};

    for (const video of videoList) {
      if (video.video_url && !thumbnails[video.id]) {
        try {
          const thumbnailUrl = await generateThumbnail(
            video.video_url,
            video.id
          );
          newThumbnails[video.id] = thumbnailUrl;
        } catch (error) {
          console.error(
            `Failed to generate thumbnail for video ${video.id}:`,
            error
          );
          newThumbnails[video.id] = null;
        }
      }
    }

    setThumbnails((prev) => ({ ...prev, ...newThumbnails }));
  };

  const extractAndStoreDuration = async (file, videoId = null) => {
    try {
      const video = document.createElement("video");
      video.preload = "metadata";

      return new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          const duration = video.duration;
          const minutes = Math.floor(duration / 60);
          const seconds = Math.ceil(duration % 60);
          const formattedDuration = `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;
          resolve({ duration: formattedDuration, durationInSeconds: duration });
        };

        video.onerror = () => {
          reject(new Error("Failed to load video metadata"));
        };

        video.src = URL.createObjectURL(file);
      });
    } catch (error) {
      console.error("Error extracting duration:", error);
      return null;
    }
  };

  const handleCreateQuestion = async () => {
    const { text, options } = questionData;

    if (!text.trim() || options.some((opt) => !opt.text.trim())) {
      toast.error("Please fill all fields before saving.");
      return;
    }

    const correctCount = options.filter((opt) => opt.is_correct).length;
    if (correctCount !== 1) {
      toast.error("Please select exactly one correct option.");
      return;
    }

    const payload = {
      course: selectedCourseForQuestion.id,
      text,
      options,
    };

    try {
      setSavingQuestion(true);
      const response = await createQuestion(payload);
      if (response.code === "200") {
        toast.success(response.message || "Question added successfully!");
        handleCloseQuestionDialog();
        fetchCourses();
      } else {
        toast.error(response.message || "Failed to create question");
      }
    } catch (error) {
      console.error("Error creating question:", error);
      toast.error("Something went wrong while creating question");
    } finally {
      setSavingQuestion(false);
    }
  };
  const fetchVideos = async () => {
    if (!selectedCourse) {
      setVideos([]);
      return;
    }

    setLoading(true);
    try {
      const response = await getVideoList();

      if (response.code === "200") {
        const videosList = response.data?.videos || [];

        const filteredVideos = videosList.filter(
          (video) => video.course_id === selectedCourse.id
        );

        if (filteredVideos.length === 0) {
          setVideos([]);
          setLoading(false);
          return;
        }

        const videosWithDuration = await Promise.all(
          filteredVideos.map(async (video) => {
            if (video.video_url && !video.duration) {
              try {
                const videoResponse = await fetch(video.video_url);
                const blob = await videoResponse.blob();
                const file = new File([blob], "temp.mp4", { type: blob.type });
                const durationData = await extractAndStoreDuration(file);

                return {
                  ...video,
                  duration: durationData ? durationData.duration : null,
                };
              } catch (error) {
                console.error(
                  `Failed to extract duration for video ${video.id}:`,
                  error
                );
                return video;
              }
            }
            return video;
          })
        );

        setVideos(videosWithDuration);
        generateThumbnailsForVideos(videosWithDuration);
      } else {
        toast.error(response.message || "Failed to fetch videos");
        setVideos([]);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to load videos");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenVideoDialog = (video) => {
    setSelectedVideo(video);
    setOpenVideoDialog(true);
  };

  const handleCloseVideoDialog = () => {
    setSelectedVideo(null);
    setOpenVideoDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      title: "",
      description: "",
      videoFile: null,
      videoFileName: "",
      is_course_video_upload_completed: false,
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        return;
      }

      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Video file size should not exceed 100MB");
        return;
      }

      setFormData({
        ...formData,
        videoFile: file,
        videoFileName: file.name,
      });
    }
  };

  const handleAddVideo = async () => {
    if (!formData.title || !formData.videoFile) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!selectedCourse) {
      toast.error("Please select a Training Module first");
      return;
    }

    setUploading(true);
    try {
      const durationData = await extractAndStoreDuration(formData.videoFile);

      const videoData = {
        course_id: selectedCourse.id,
        title: formData.title,
        description: formData.description,
        videoFile: formData.videoFile,
        is_course_video_upload_completed:
          formData.is_course_video_upload_completed ? 1 : 0,
      };
      console.log("🚀 ~ handleAddVideo ~ videoData:", videoData);

      const response = await addVideo(videoData);

      if (response.code === "200") {
        if (durationData && response.data && response.data.video) {
          const newVideo = {
            ...response.data.video,
            duration: durationData.duration,
          };

          setVideos((prevVideos) => [...prevVideos, newVideo]);
        }

        toast.success(response.message || "Video uploaded successfully!");
        handleCloseDialog();
        fetchVideos();
        fetchCourses();
      } else {
        toast.error(response.message || "Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video");
    } finally {
      setUploading(false);
    }
  };
  const handleDeleteVideo = async (videoId) => {
    setVideoToDelete(videoId);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteVideo = async () => {
    if (!videoToDelete) return;

    try {
      const response = await deleteVideo({ video_id: videoToDelete });
      if (response.code === "200") {
        toast.success("Video deleted successfully!");
        setVideos(videos.filter((video) => video.id !== videoToDelete));
        setThumbnails((prev) => {
          const newThumbnails = { ...prev };
          delete newThumbnails[videoToDelete];
          return newThumbnails;
        });
        fetchCourses();
      } else {
        toast.error(response.message || "Failed to delete video");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    } finally {
      setOpenDeleteDialog(false);
      setVideoToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setVideoToDelete(null);
  };

  const statsCards = [
    {
      title: "Total Training Modules",
      value: courses.length.toString(),
      subtitle: "Active Training Modules",
      icon: <SchoolIcon />,
      iconBg: "#E8F4F8",
      iconColor: "#5B9FBD",
    },
    {
      title: "Total Videos",
      value: getTotalVideos().toString(),
      subtitle: "All Training Modules combined",
      icon: <VideoLibraryIcon />,
      iconBg: "#FFF4E6",
      iconColor: "#FF9800",
    },
    {
      title: "Training Module Videos",
      value: videos.length.toString(),
      subtitle: selectedCourse
        ? `In ${selectedCourse.course_name}`
        : "Select a Training Module",
      icon: <PlayCircleIcon />,
      iconBg: "#F3E8FF",
      iconColor: "#9C27B0",
    },
  ];

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
              <VideoLibraryIcon sx={{ color: "#fff", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: "#1a3a4a",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
              >
                Module & Video Management
              </Typography>
              <Typography
                sx={{
                  color: "#8b9ba5",
                  fontSize: "13px",
                }}
              >
                Manage training module and training videos
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleOpenCourseDialog()}
              sx={{
                borderColor: "#5B9FBD",
                color: "#5B9FBD",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                px: 3,
                "&:hover": {
                  borderColor: "#4a8a9f",
                  bgcolor: "#f8fbfd",
                },
              }}
            >
              Add Training Module
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              disabled={!selectedCourse}
              sx={{
                bgcolor: "#5B9FBD",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                px: 3,
                "&:hover": {
                  bgcolor: "#4a8a9f",
                },
                "&:disabled": {
                  bgcolor: "#e8eef2",
                  color: "#8b9ba5",
                },
              }}
            >
              Add Video
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: "12px",
                boxShadow: "none",
                border: "1px solid #e8eef2",
                bgcolor: "#fff",
                width: "100%",
              }}
            >
              <CardContent sx={{ pt: 2.5, pb: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: card.iconBg,
                      borderRadius: "8px",
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {React.cloneElement(card.icon, {
                      sx: { color: card.iconColor, fontSize: 20 },
                    })}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#22394C",
                      width: "200px",
                      fontWeight: 600,
                    }}
                  >
                    {card.title}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#1a3a4a",
                    fontWeight: 700,
                    fontSize: "32px",
                    mb: 0.5,
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#22394C",
                    fontWeight: 600,
                  }}
                >
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Course Selection Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{ fontWeight: 600, color: "#1a3a4a", fontSize: "16px", mb: 2 }}
        >
          Select Training Module
        </Typography>

        {loadingCourses ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} sx={{ color: "#5B9FBD" }} />
          </Box>
        ) : courses.length === 0 ? (
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: "12px",
              border: "1px solid #e8eef2",
              boxShadow: "none",
              bgcolor: "#fff8e1",
            }}
          >
            <SchoolIcon sx={{ fontSize: 48, color: "#f57f17", mb: 1 }} />
            <Typography sx={{ color: "#f57f17", fontWeight: 600, mb: 1 }}>
              No Training Modules Available
            </Typography>
            <Typography sx={{ color: "#8b9ba5", fontSize: "14px", mb: 2 }}>
              Create your first Training Module to start adding videos
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenCourseDialog()}
              sx={{
                bgcolor: "#5B9FBD",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: "#4a8a9f",
                },
              }}
            >
              Create Training Module
            </Button>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                <Card
                  onClick={() => setSelectedCourse(course)}
                  sx={{
                    borderRadius: "12px",
                    border:
                      selectedCourse?.id === course.id
                        ? "2px solid #5B9FBD"
                        : "1px solid #e8eef2",
                    boxShadow: "none",
                    bgcolor:
                      selectedCourse?.id === course.id ? "#f8fbfd" : "#fff",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor:
                            selectedCourse?.id === course.id
                              ? "#5B9FBD"
                              : "#E8F4F8",
                          borderRadius: "8px",
                          width: 36,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SchoolIcon
                          sx={{
                            color:
                              selectedCourse?.id === course.id
                                ? "#fff"
                                : "#5B9FBD",
                            fontSize: 18,
                          }}
                        />
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCourseMenu(e, course);
                        }}
                        sx={{ color: "#8b9ba5", p: 0.5 }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography
                      sx={{
                        color: "#1a3a4a",
                        fontWeight: 700,
                        fontSize: "14px",
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={course.course_name}
                    >
                      {course.course_name}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 1.5,
                      }}
                    >
                      <VideoLibraryIcon
                        sx={{ fontSize: 14, color: "#5B9FBD" }}
                      />
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#5B9FBD",
                          fontWeight: 600,
                        }}
                      >
                        {course.video_count || 0} videos
                      </Typography>
                    </Box>

                    {course.question_count > 0 && (
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "#5B9FBD",
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        {course.question_count} question
                        {course.question_count > 1 ? "s" : ""} added
                      </Typography>
                    )}

                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenQuestionDialog(course);
                        }}
                        sx={{
                          textTransform: "none",
                          color: "#5B9FBD",
                          borderColor: "#5B9FBD",
                          fontSize: "11px",
                          borderRadius: "6px",
                          "&:hover": {
                            borderColor: "#4a8a9f",
                            bgcolor: "#f8fbfd",
                          },
                        }}
                      >
                        Add Question
                      </Button>

                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenQuestionListDialog(course);
                        }}
                        disabled={course.question_count === 0}
                        sx={{
                          textTransform: "none",
                          color: "#5B9FBD",
                          borderColor: "#5B9FBD",
                          fontSize: "11px",
                          borderRadius: "6px",
                          "&:hover": {
                            borderColor: "#4a8a9f",
                            bgcolor: "#f8fbfd",
                          },
                          "&:disabled": {
                            borderColor: "#e8eef2",
                            color: "#bdbdbd",
                          },
                        }}
                      >
                        View Questions
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Videos Section */}
      {selectedCourse && (
        <>
          <Box sx={{ mb: 2, mt: 4 }}>
            <Typography
              sx={{ fontWeight: 600, color: "#1a3a4a", fontSize: "16px" }}
            >
              Videos in "{selectedCourse.course_name}"
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress sx={{ color: "#5B9FBD" }} />
            </Box>
          ) : videos.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "40vh",
                textAlign: "center",
              }}
            >
              <VideoLibraryIcon
                sx={{ fontSize: 64, color: "#e8eef2", mb: 2 }}
              />
              <Typography sx={{ color: "#8b9ba5", mb: 2 }}>
                No videos in this Training Module yet. Click "Add Video" to upload your
                first video.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
                sx={{
                  bgcolor: "#5B9FBD",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  px: 3,
                  "&:hover": {
                    bgcolor: "#4a8a9f",
                  },
                }}
              >
                Add Video
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                  <Card
                    sx={{
                      borderRadius: "12px",
                      border: "1px solid #e8eef2",
                      boxShadow: "none",
                      transition: "all 0.25s ease",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "16 / 9",
                        bgcolor: "#5B9FBD",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                        position: "relative",
                        overflow: "hidden",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                      onClick={() => handleOpenVideoDialog(video)}
                    >
                      {thumbnails[video.id] ? (
                        <Box
                          component="img"
                          src={thumbnails[video.id]}
                          alt={video.title}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "#5B9FBD",
                          }}
                        >
                          <PlayCircleIcon
                            sx={{ fontSize: 48, color: "#fff", opacity: 0.6 }}
                          />
                        </Box>
                      )}

                      {video.duration && (
                        <Chip
                          label={video.duration}
                          size="small"
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.75)",
                            color: "#fff",
                            fontSize: "11px",
                            height: "22px",
                            borderRadius: "6px",
                          }}
                        />
                      )}
                    </Box>

                    <CardContent
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        p: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          mb: 1.5,
                          minHeight: "44px",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#1a3a4a",
                            fontWeight: 600,
                            fontSize: "14px",
                            flex: 1,
                            pr: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            textTransform: "capitalize",
                          }}
                          title={video.title}
                        >
                          {video.title}
                        </Typography>

                        <IconButton
                          size="small"
                          sx={{ color: "#8b9ba5", p: 0.5 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVideo(video.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Typography
                        sx={{
                          color: "#8b9ba5",
                          fontSize: "12px",
                          minHeight: "36px",
                          mb: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {video.description || "No description available"}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: "auto",
                        }}
                      >
                        <Typography sx={{ fontSize: "11px", color: "#8b9ba5" }}>
                          Uploaded:{" "}
                          {video.uploaded
                            ? new Date(video.uploaded).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Course Menu */}
      <Menu
        anchorEl={courseMenuAnchor}
        open={Boolean(courseMenuAnchor)}
        onClose={handleCloseCourseMenu}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <MenuItem
          onClick={() => handleOpenCourseDialog(selectedCourseForMenu)}
          sx={{ fontSize: "14px", gap: 1 }}
        >
          <EditIcon fontSize="small" sx={{ color: "#5B9FBD" }} />
          Edit Training Module
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteCourse(selectedCourseForMenu)}
          sx={{ fontSize: "14px", gap: 1, color: "#d32f2f" }}
        >
          <DeleteIcon fontSize="small" />
          Delete Training Module
        </MenuItem>
      </Menu>

      {/* Add/Edit Course Dialog */}
      <Dialog
        open={openCourseDialog}
        onClose={handleCloseCourseDialog}
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
          }}
        >
          {editCourseMode ? "Edit Training Module" : "Add Training Module"}
          <IconButton onClick={handleCloseCourseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label=" Name"
              name="course_name"
              value={courseFormData.course_name}
              onChange={handleCourseInputChange}
              fullWidth
              required
              variant="outlined"
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseCourseDialog}
            sx={{ textTransform: "none", color: "#8b9ba5" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitCourse}
            variant="contained"
            disabled={savingCourse}
            sx={{
              bgcolor: "#5B9FBD",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                bgcolor: "#4a8a9f",
              },
            }}
          >
            {savingCourse ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : editCourseMode ? (
              "Update Training Module"
            ) : (
              "Add Training Module"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Question List Dialog */}
      <Dialog
        open={openQuestionListDialog}
        onClose={handleCloseQuestionListDialog}
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
          }}
        >
          Questions for: {selectedCourseForQuestionList?.course_name}
          <IconButton onClick={handleCloseQuestionListDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {loadingQuestions ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={32} sx={{ color: "#5B9FBD" }} />
            </Box>
          ) : questionsList.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography sx={{ color: "#8b9ba5", mb: 2 }}>
                No questions available for this Training Module.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {questionsList.map((question, index) => (
                <Card
                  key={question.id}
                  sx={{
                    p: 2,
                    border: "1px solid #e8eef2",
                    borderRadius: "8px",
                    boxShadow: "none",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#1a3a4a",
                      fontSize: "14px",
                      mb: 1.5,
                    }}
                  >
                    Q{index + 1}. {question.text}
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {question.options?.map((option, optIndex) => (
                      <Box
                        key={option.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1,
                          borderRadius: "6px",
                          bgcolor: option.is_correct ? "#e8f5e9" : "#f5f5f5",
                          border: option.is_correct
                            ? "1px solid #4caf50"
                            : "1px solid transparent",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: option.is_correct ? "#2e7d32" : "#5f6368",
                            fontWeight: option.is_correct ? 600 : 400,
                          }}
                        >
                          {String.fromCharCode(65 + optIndex)}. {option.text}
                        </Typography>
                        {option.is_correct && (
                          <Chip
                            label="Correct"
                            size="small"
                            sx={{
                              bgcolor: "#4caf50",
                              color: "#fff",
                              fontSize: "10px",
                              height: "20px",
                              ml: "auto",
                            }}
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseQuestionListDialog}
            variant="contained"
            sx={{
              bgcolor: "#5B9FBD",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                bgcolor: "#4a8a9f",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Course Dialog */}
      <Dialog
        open={openDeleteCourseDialog}
        onClose={handleCloseDeleteCourseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1a3a4a" }}>
          Delete Training Module
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#8b9ba5", fontSize: "14px" }}>
            Are you sure you want to delete "{courseToDelete?.course_name}"?
            This will also delete all videos associated with this Training Module. This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseDeleteCourseDialog}
            sx={{ textTransform: "none", color: "#8b9ba5" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteCourse}
            variant="contained"
            sx={{
              bgcolor: "#d32f2f",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                bgcolor: "#c62828",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Video Player Dialog */}
      <Dialog
        open={openVideoDialog}
        onClose={handleCloseVideoDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px", overflow: "hidden" },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#1a3a4a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {selectedVideo?.title || "Video Player"}
          <IconButton onClick={handleCloseVideoDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedVideo?.video_url ? (
            <Box sx={{ position: "relative", pb: "56.25%", height: 0 }}>
              <video
                src={selectedVideo.video_url}
                controls
                autoPlay
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "black",
                }}
              />
            </Box>
          ) : (
            <Typography sx={{ p: 3, textAlign: "center", color: "#8b9ba5" }}>
              Video not available
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Video Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
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
          }}
        >
          Add New Video to "{selectedCourse?.course_name}"
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Video Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
            />
            <Box>
              <input
                accept="video/*"
                style={{ display: "none" }}
                id="video-upload"
                type="file"
                onChange={handleVideoUpload}
              />
              <label htmlFor="video-upload">
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
                  {formData.videoFileName || "Upload Video"}
                </Button>
              </label>
              {formData.videoFileName && (
                <Typography sx={{ mt: 1, fontSize: "12px", color: "#8b9ba5" }}>
                  Selected: {formData.videoFileName}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                mt: 1,
                p: 2,
                bgcolor: "#f8fbfd",
                borderRadius: "8px",
                border: "1px solid #e8eef2",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_course_video_upload_completed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_course_video_upload_completed: e.target.checked,
                      })
                    }
                    sx={{
                      color: "#5B9FBD",
                      "&.Mui-checked": {
                        color: "#5B9FBD",
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1a3a4a",
                      }}
                    >
                      Mark Training Module video upload as completed
                    </Typography>
                    <Typography
                      sx={{ fontSize: "11px", color: "#8b9ba5", mt: 0.5 }}
                    >
                      Check this if you have finished uploading all videos for "
                      {selectedCourse?.course_name}"
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{ textTransform: "none", color: "#8b9ba5" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddVideo}
            variant="contained"
            disabled={uploading}
            sx={{
              bgcolor: "#5B9FBD",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                bgcolor: "#4a8a9f",
              },
            }}
          >
            {uploading ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              "Add Video"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Video Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1a3a4a" }}>
          Delete Video
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#8b9ba5", fontSize: "14px" }}>
            Are you sure you want to delete this video? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{ textTransform: "none", color: "#8b9ba5" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteVideo}
            variant="contained"
            sx={{
              bgcolor: "#d32f2f",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                bgcolor: "#c62828",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Question Dialog */}
      <Dialog
        open={openQuestionDialog}
        onClose={handleCloseQuestionDialog}
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
          }}
        >
          Add Question for: {selectedCourseForQuestion?.course_name}
          <IconButton onClick={handleCloseQuestionDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Question Text"
              fullWidth
              value={questionData.text}
              onChange={(e) =>
                setQuestionData({ ...questionData, text: e.target.value })
              }
            />

            {questionData.options.map((option, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <TextField
                  label={`Option ${index + 1}`}
                  fullWidth
                  value={option.text}
                  onChange={(e) => {
                    const newOptions = [...questionData.options];
                    newOptions[index].text = e.target.value;
                    setQuestionData({ ...questionData, options: newOptions });
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={option.is_correct}
                      onChange={() => {
                        const newOptions = questionData.options.map(
                          (opt, i) => ({
                            ...opt,
                            is_correct: i === index,
                          })
                        );
                        setQuestionData({
                          ...questionData,
                          options: newOptions,
                        });
                      }}
                    />
                  }
                  label="Correct"
                />
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseQuestionDialog}
            sx={{ textTransform: "none", color: "#8b9ba5" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateQuestion}
            variant="contained"
            disabled={savingQuestion}
            sx={{
              bgcolor: "#5B9FBD",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                bgcolor: "#4a8a9f",
              },
            }}
          >
            {savingQuestion ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              "Save Question"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoManagement;
