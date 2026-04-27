import axios from "axios";

// Khởi tạo client với cấu trúc cơ bản
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// Thêm interceptor để tự động đính Token vào mỗi request (nếu cần)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const courseDetailApi = {
  // Lấy chi tiết bài học (Video, Transcript, AI Summary)
  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/history/${id}`);
      
      /**
       * LUY Ý: Dựa trên Postman, dữ liệu nằm trong response.data.result
       * Mình bóc tách luôn ở đây để Frontend dùng cho tiện
       */
      if (response.data && response.data.result) {
        return response.data.result; 
      }
      
      return response.data;
    } catch (error) {
      console.error("CourseDetailApi Error:", error);
      throw error;
    }
  },

  // API Chat với AI cho bài học này
  askAI: async (sessionId, question) => {
    try {
      const response = await axiosClient.post(`/sessions/${sessionId}/chat`, { 
        question 
      });
      return response.data.result;
    } catch (error) {
      console.error("AskAI Error:", error);
      throw error;
    }
  },
};