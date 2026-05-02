import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Axios instance cấu hình chung cho Dashboard
 */
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Tự động chèn Token vào Header trước khi gửi request
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const dashboardApi = {
    /**
     * Lấy dữ liệu phân tích tổng quan cho Dashboard
     */
    getAnalytics: async () => {
        try {
            const response = await api.get('/analytics/dashboard');
            const res = response.data.result;

            const hours = Math.floor(res.totalHours || 0);
            const minutes = Math.round(((res.totalHours || 0) - hours) * 60);

            return {
                user: {
                    fullName: res.fullname || res.fullName || "User"
                },
                overview: {
                    totalStudyTime: `${hours}h ${minutes}m`,
                    lecturesDone: res.totalLectures || 0,
                    goalProgress: Math.min(Math.round(((res.totalHours || 0) / (res.weekGoal || 10)) * 100), 100)
                },
                weeklyActivity: (res.weeklyProgress || []).map(p => ({
                    day: p.day ? p.day.substring(0, 3) : "??",
                    hours: p.hours || 0,
                    active: p.day === new Date().toLocaleDateString('en-US', { weekday: 'short' })
                })),
                topKeywords: res.topKeywords || [],
                recentCourses: []
            };
        } catch (error) {
            console.error("API Error: getAnalytics", error.message);
            throw error;
        }
    },

    /**
     * Lấy danh sách lịch sử phiên học cho trang History
     */
    getAllHistory: async () => {
        try {
            const response = await api.get('/history');
            const data = response.data.result;

            if (Array.isArray(data)) {
                return data.map(item => ({
                    id: item.sessionId,
                    title: item.title || "YouTube Lecture",
                    createdAt: item.createdAt,
                    duration: item.duration || 0,
                    type: item.videoUrl ? 'YouTube' : 'Upload',
                    category: 'CS',
                    progress: item.progress || 0,
                    status: item.status
                }));
            }
            return [];
        } catch (error) {
            console.error("API Error: getAllHistory", error.message);
            throw error;
        }
    }
};