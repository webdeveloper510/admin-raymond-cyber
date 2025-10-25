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

    const response = await api.post(`/update-employee/${employeeId}/`, employeeData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

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

    const response = await api.post("/superadmin/reject-company/", 
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

export default api;