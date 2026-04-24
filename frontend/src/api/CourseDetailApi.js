import axios from "axios";

// Khởi tạo client với cấu hình cơ bản
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

export const courseDetailApi = {
  // Lấy chi tiết bài học (Video, Transcript, AI Summary)
  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/history/${id}`);
      return response.data; 
    } catch (error) {
      console.error("CourseDetailApi Error:", error);
      throw error;
    }
  },

  // askAI: (sessionId, question) => axiosClient.post(`/sessions/${sessionId}/chat`, { question }),
};