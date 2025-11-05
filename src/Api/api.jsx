import axios from "axios";

const BASE_URL = "https://api.mycyberedu.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Send OTP API
export const sendOtp = async (data) => {
  try {
    const response = await api.post("/send-otp/", data);

    // 🔹 Store verification token if received
    const verificationToken = response.data?.data?.verification_token;
    if (verificationToken) {
      localStorage.setItem("verification_token", verificationToken);
    }

    return response.data;
  } catch (error) {
    console.error("Send OTP API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while sending OTP.",
      }
    );
  }
};

// ✅ Verify OTP API (token from localStorage added in headers)
export const verifyOtp = async (data) => {
  try {
    const token = localStorage.getItem("verification_token");

    const response = await api.post("/verify-otp/", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Verify OTP API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while verifying OTP.",
      }
    );
  }
};

// ✅ Login API
export const loginCompany = async (data) => {
  try {
    const response = await api.post("/login/", data);
    return response.data;
  } catch (error) {
    console.error("Login API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong during login.",
      }
    );
  }
};

// ✅ Create Subscription API
export const createSubscription = async (email) => {
  try {
    const response = await api.post("/create-subscription/", { email });
    return response.data;
  } catch (error) {
    console.error("Create Subscription API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while creating subscription.",
      }
    );
  }
};

export const verifySubscription = async (email, subscriptionId) => {
  try {
    const payload = {
      email: email,
      subscription_id: subscriptionId,
    };

    const response = await api.post("/subscription/", payload);

    return response.data;
  } catch (error) {
    console.error("Verify Subscription API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while verifying subscription.",
      }
    );
  }
};

export const getRequestList = async () => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await api.get("/superadmin/requster-list/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Get Request List API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while fetching request list.",
      }
    );
  }
};

export const resetPassword = async (token, password) => {
  try {
    const payload = {
      token: token,
      password: password,
    };
    const response = await api.post("/set-password/", payload);
    return response.data;
  } catch (error) {
    console.error("Reset Password API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while resetting password.",
      }
    );
  }
};

// ✅ Add Employee API (with access_token)
export const addEmployee = async (employeeData) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await api.post("/add-employee/", employeeData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Add Employee API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while adding employee.",
      }
    );
  }
};

// ✅ Get Employee List API (with access_token)
export const getEmployeeList = async () => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await api.get("/employee-list/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Get Employee List API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while fetching employee list.",
      }
    );
  }
};

// ✅ Get Profile Details API (with access_token)
export const getProfileDetail = async () => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await api.get("/update-company-profile/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Get Profile Detail API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while fetching profile details.",
      }
    );
  }
};

// ✅ Update Profile API (PUT method with access_token)
export const updateProfile = async (profileData) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await api.put("/update-company-profile/", profileData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Update Profile API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while updating profile.",
      }
    );
  }
};

// ✅ Update Employee API
export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await api.post(
      `/update-employee/${employeeId}/`,
      employeeData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Update Employee API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while updating employee.",
      }
    );
  }
};
export const getSubscriptionDetail = async () => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await api.get("/subscription-plan/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Get Subscription Detail API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while fetching subscription details.",
      }
    );
  }
};
export const rejectCompany = async (email) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await api.post(
      "/superadmin/reject-company/",
      { email },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Reject Company API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while rejecting company.",
      }
    );
  }
};
export const addVideo = async (videoData) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const formData = new FormData();

    formData.append("course_id", videoData.course_id);
    formData.append("title", videoData.title);
    formData.append("description", videoData.description || "");
    formData.append("video", videoData.videoFile);
    formData.append(
      "is_course_video_upload_completed",
      videoData.is_course_video_upload_completed !== undefined 
        ? videoData.is_course_video_upload_completed 
        : 0
    );
    const response = await api.post("/upload-video/", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Add Video API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while uploading video.",
      }
    );
  }
};
export const getVideoList = async () => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await api.get("/upload-video/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Get Video List API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while fetching video list.",
      }
    );
  }
};

export const deleteVideo = async (payload) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await api.delete(`/upload-video/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: payload,
    });
    return response.data;
  } catch (error) {
    console.error("Delete Video API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while deleting video.",
      }
    );
  }
};
export const createQuestion = async (questionData) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await api.post("/question-create/", questionData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Create Question API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while creating question.",
      }
    );
  }
};
export const addCourse = async (courseData) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await api.post("/create-course/", courseData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding course:", error);
    return {
      code: "500",
      message: error.response?.data?.message || "Failed to add course",
    };
  }
};
export const editCourse = async (courseId, courseData) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await api.put(`/course/${courseId}/`, courseData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error editing course:", error);
    return {
      code: "500",
      message: error.response?.data?.message || "Failed to update course",
    };
  }
};
export const deleteCourse = async (courseId) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await api.delete(`/course/${courseId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting course:", error);
    return {
      code: "500",
      message: error.response?.data?.message || "Failed to delete course",
    };
  }
};

export const getCourseList = async () => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await api.get("/course-list/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      code: "500",
      message: error.response?.data?.message || "Failed to fetch courses",
      data: { courses: [] },
    };
  }
};

export const getCompanyEmployeeList = async () => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await api.get("/superadmin/company_employee_list/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Get Video List API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while fetching video list.",
      }
    );
  }
};
export const getUserAnswers = async (userId) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await api.get(`/superadmin/user/answers/${userId}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
  } catch (error) {
    console.error("Get User Answers API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while fetching user answers.",
      }
    );
  }
};
export const uploadCertificate = async (formData) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await api.post("/superadmin/certificates/", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Upload Certificate API Error:", error);
    return (
      error.response?.data || {
        message: "Something went wrong while uploading certificate.",
      }
    );
  }
};
export const getCompletedVideoQuestions = async (courseId) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await api.get(
      `/questions-completed-videos-list/?course_id=${courseId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Get Completed Video Questions API Error:", error);
    return (
      error.response?.data || {
        message:
          "Something went wrong while fetching completed video questions.",
      }
    );
  }
};

export default api;
