// src/services/http.js
import axios from 'axios';

// Cấu hình Base URL cho Backend API
const API_BASE_URL = 'http://localhost:8000/api'; // Thay đổi cổng nếu Backend của bạn khác

const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor (Can thiệp) để thêm token vào mỗi yêu cầu
http.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default http;