import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/v1`,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const courseApi = {
    getAll: (userId) => api.get(`/courses?userId=${userId}`),

    getCourseDetail: (courseId, userId) => api.get(`/courses/${courseId}?userId=${userId}`),
    getTransactions: (userId) => api.get(`/transactions/user/${userId}`),

    updateProgress: (data) => api.patch('/enrollments/progress', null, { params: data })
};

export default courseApi;