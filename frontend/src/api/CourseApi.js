import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/v1`,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Đây mới là courseApi chuẩn có chứa hàm getCourseDetail cho CourseLanding.jsx gọi nè ní!
export const courseApi = {
  getCourseDetail: async (courseId, userId) => {
    try {
      const response = await axiosClient.get(`/courses/${courseId}`, {
        params: { userId: userId }
      });
      return response; 
    } catch (error) {
      console.error("[CourseApi] getCourseDetail error:", error);
      throw error;
    }
  }
};