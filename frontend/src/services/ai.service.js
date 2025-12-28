import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // URL của Backend AI

const aiService = {
  // Gửi link video để tóm tắt
  getSummary: async (videoUrl) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/summarize`, { url: videoUrl });
      return response.data;
    } catch (error) {
      console.error("Lỗi gọi AI:", error);
      throw error;
    }
  },

  // Chat hỏi đáp kiến thức
  chatWithAI: async (message, context) => {
    return await axios.post(`${API_BASE_URL}/chat`, { message, context });
  }
};

export default aiService;