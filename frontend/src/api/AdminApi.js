import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const ADMIN_BASE_URL = `${API_URL}/api/v1/admin`;
const USER_BASE_URL = `${API_URL}/api/v1`;

const adminClient = axios.create({
  baseURL: ADMIN_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const userClient = axios.create({
  baseURL: USER_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const attachAuthToken = (config) => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

adminClient.interceptors.request.use(attachAuthToken);
userClient.interceptors.request.use(attachAuthToken);

function unwrapResponse(response) {
  console.log("Response data:", response?.data);
  const result = response?.data?.result ?? response?.data ?? null;
  console.log("Unwrapped result:", result);
  return result;
}

export const adminApi = {
  getDashboardMetrics: async () => {
    const response = await adminClient.get("/dashboard/metrics");
    return unwrapResponse(response);
  },

  getAllUsers: async () => {
    const response = await userClient.get("/users");
    return unwrapResponse(response);
  },

  getAllPayments: async () => {
    const response = await adminClient.get("/payments");
    return unwrapResponse(response);
  },

  getPaymentsPaginated: async (params) => {
    const response = await adminClient.get(`/payments/paginated?${params.toString()}`);
    return unwrapResponse(response);
  },

  deletePayment: async (paymentId) => {
    const response = await adminClient.delete(`/payments/${paymentId}`);
    return unwrapResponse(response);
  },

  updateUser: async (userId, data) => {
    const response = await userClient.put(`/users/${userId}`, data);
    return unwrapResponse(response);
  },

  deleteUser: async (userId) => {
    const response = await userClient.delete(`/users/${userId}`);
    return unwrapResponse(response);
  },

  togglePremium: async (userId, isPremium) => {
    const response = await userClient.patch(`/users/${userId}/premium`, {
      isPremium: isPremium,
    });
    return unwrapResponse(response);
  },

  getUsers: async () => {
    return adminApi.getAllUsers();
  },

  getPayments: async () => {
    return adminApi.getAllPayments();
  },

  getCourses: async () => {
    const response = await userClient.get("/courses");
    return unwrapResponse(response);
  },

  getCourseDetail: async (courseId) => {
    const response = await userClient.get(`/courses/${courseId}`);
    return unwrapResponse(response);
  },

  createCourse: async (formData) => {
    const response = await adminClient.post("/courses", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return unwrapResponse(response);
  },

  updateCourse: async (courseId, formData) => {
    const response = await adminClient.put(`/courses/${courseId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return unwrapResponse(response);
  },

  deleteCourse: async (courseId) => {
    const response = await adminClient.delete(`/courses/${courseId}`);
    return unwrapResponse(response);
  },

  createLesson: async (courseId, formData, onProgress) => {
    const response = await adminClient.post(`/courses/${courseId}/lessons`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress,
    });
    return unwrapResponse(response);
  },

  updateLesson: async (lessonId, formData, onProgress) => {
    const response = await adminClient.put(`/lessons/${lessonId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress,
    });
    return unwrapResponse(response);
  },

  deleteLesson: async (lessonId) => {
    const response = await adminClient.delete(`/lessons/${lessonId}`);
    return unwrapResponse(response);
  },

  getLessonComments: async (lessonId) => {
    const response = await userClient.get(`/comments/lesson/${lessonId}`);
    return unwrapResponse(response);
  },

  deleteComment: async (commentId) => {
    const response = await adminClient.delete(`/comments/${commentId}`);
    return unwrapResponse(response);
  },
};