import axios from 'axios';

/**
 * Cấu hình Axios instance cho hệ thống Dashboard
 */
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/v1`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Service xử lý các nghiệp vụ liên quan đến lịch sử học tập
 */
export const dashboardApi = {
    /**
     * Lấy danh sách lịch sử phiên học (Sessions)
     * @returns {Promise<Array>} Danh sách các bài giảng đã được định dạng
     */
    getAllHistory: async () => {
        try {
            const response = await api.get('/sessions');
            const data = response.data.result;

            if (!data) return [];

            // Chuẩn hóa dữ liệu từ backend sang format frontend
            return data.map(item => ({
                id: item.sessionId,
                title: item.title || "Untitled Lecture",
                createdAt: item.createdAt,
                duration: item.duration || 0,
                type: item.videoUrl ? 'YouTube' : 'Local Storage',
                category: item.category || 'General',
                progress: item.progress || 0,
                status: item.status || 'PENDING'
            }));
        } catch (error) {
            console.error("API Error: getAllHistory", error);
            throw error;
        }
    },

    /**
     * Lấy chi tiết nội dung bài học dựa trên ID
     * @param {string} sessionId 
     */
    getSessionById: async (sessionId) => {
        try {
            const response = await api.get(`/sessions/${sessionId}`);
            return response.data.result;
        } catch (error) {
            console.error(`API Error: getSessionById(${sessionId})`, error);
            throw error;
        }
    }
};