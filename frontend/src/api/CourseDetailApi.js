import axios from "axios";

/* ========================
   1. AXIOS CLIENT JAVA
======================== */
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// Interceptor gắn token
axiosClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ========================
   2. AXIOS CLIENT PYTHON (AI)
======================== */
const aiClient = axios.create({
  baseURL: "http://localhost:8000/ai",
});

/* ========================
   3. COURSE / MESSAGE API (JAVA)
======================== */
export const courseDetailApi = {
  // Lấy chi tiết khóa học
  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/history/${id}`);

      if (response.data && response.data.result) {
        return response.data.result;
      }

      return response.data;
    } catch (error) {
      console.error("CourseDetailApi Error:", error);
      throw error;
    }
  },

  // Lấy lịch sử chat
  getChatHistory: async (sessionId, page = 1) => {
    try {
      const response = await axiosClient.get(
        `/messages/${sessionId}?page=${page}&size=20`
      );

      return response.data.result;
    } catch (error) {
      console.error("GetChatHistory Error:", error);
      throw error;
    }
  },

  // Lưu message user vào Java
  sendMessage: async (sessionId, content) => {
    try {
      const response = await axiosClient.post(
        `/messages`,
        {
          sessionId: sessionId,
          content: content,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.result;
    } catch (error) {
      console.error("SendMessage Error:", error);
      throw error;
    }
  },
};

/* ========================
   4. AI CHAT API (PYTHON)
======================== */
export const aiApi = {
  chat: async (sessionId, query, history = []) => {
    try {
      const response = await aiClient.post(
        `/chat`,
        {
          session_id: sessionId,
          query: query,
          history: history,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // { answer: "..." }
    } catch (error) {
      console.error("AI Chat Error:", error);
      throw error;
    }
  },
};