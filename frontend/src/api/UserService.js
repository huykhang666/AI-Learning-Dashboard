import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/v1`;

const apiClient = axios.create({
    baseURL: BASE_URL,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const userService = {
    getMyInfo: async () => {
        const response = await apiClient.get('/users/my-info');
        return response.data;
    },


    getCourses: async (userId) => {
        const response = await apiClient.get('/courses', { params: { userId } });
        return response.data;
    },

    getTransactions: async (userId) => {
        const response = await apiClient.get(`/transactions/user/${userId}`);
        return response.data;
    }
};