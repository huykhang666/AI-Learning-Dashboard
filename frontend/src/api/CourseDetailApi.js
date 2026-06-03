import axios from "axios";

/* ========================
   1. AXIOS CLIENT JAVA
======================== */
const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/v1`,
});

// Interceptor gắn token 
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ========================
   2. AXIOS CLIENT PYTHON (AI) 
======================== */
const aiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/ai`
    : "http://localhost:8000/ai",
});

/* ========================
   3. COURSE DETAIL / MESSAGE / QUIZ API (JAVA) 
======================== */
export const courseDetailApi = {
  // Lấy chi tiết bài học theo session ID
  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/history/${id}`);
      if (response.data?.result) return response.data.result;
      return response.data;
    } catch (error) {
      console.error("[CourseDetailApi] getById error:", error);
      throw error;
    }
  },

  // Lấy lịch sử chat theo session
  getChatHistory: async (sessionId, page = 1) => {
    try {
      const response = await axiosClient.get(
        `/messages/${sessionId}?page=${page}&size=20`
      );
      return response.data.result;
    } catch (error) {
      console.error("[CourseDetailApi] getChatHistory error:", error);
      throw error;
    }
  },

  // Lưu tin nhắn user lên Java backend
  sendMessage: async (sessionId, content) => {
    try {
      const response = await axiosClient.post("/messages", {
        sessionId,
        content,
      });
      return response.data.result;
    } catch (error) {
      console.error("[CourseDetailApi] sendMessage error:", error);
      throw error;
    }
  },

  // Cập nhật tiến độ xem video
  updateProgress: async (sessionId, currentSecond) => {
    try {
      const response = await axiosClient.post("/progress/update", {
        sessionId: Number(sessionId),
        currentSecond: Math.floor(currentSecond),
      });
      return response.data;
    } catch (error) {
      console.warn("[CourseDetailApi] updateProgress failed silently:", error);
    }
  },

  saveDuration: async (id, data) => {
    try {
      const response = await axiosClient.patch(`/history/${id}/duration`, data);
      return response.data;
    } catch (error) {
      console.warn('[CourseDetailApi] saveDuration failed:', error);
    }
  },

  // --- 📝 API LẤY HOẶC TỰ ĐỘNG TẠO QUIZ QUA JAVA ENDPOINT ---
  getOrGenerateQuiz: async (courseId, transcriptText) => {
    try {
      const response = await axiosClient.post(`/courses/${courseId}/quizzes/fetch`, {
        transcript: transcriptText
      });
      return response.data;
    } catch (error) {
      console.error("[CourseDetailApi] getOrGenerateQuiz error:", error);
      throw error;
    }
  },

  // --- 📝 API NỘP BÀI CHẤM ĐIỂM TRỰC TUYẾN BẢO MẬT ---
  submitQuizAnswers: async (courseId, answersMap) => {
    try {
      const response = await axiosClient.post(`/courses/${courseId}/quizzes/submit`, {
        answers: answersMap
      });
      return response.data;
    } catch (error) {
      console.error("[CourseDetailApi] submitQuizAnswers error:", error);
      throw error;
    }
  }
};

/* ========================
   4. AI CHAT API (PYTHON)
======================== */
export const aiApi = {
  chat: async (sessionId, query, history = []) => {
    try {
      const response = await aiClient.post("/chat", {
        session_id: sessionId,
        query,
        history,
      });
      return response.data;
    } catch (error) {
      console.error("[aiApi] chat error:", error);
      throw error;
    }
  },
};