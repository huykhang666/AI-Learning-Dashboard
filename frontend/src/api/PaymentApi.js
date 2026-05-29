import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/payment`;  

const apiClient = axios.create({
    baseURL: BASE_URL,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const paymentApi = {
    createPaymentUrl: async (paymentRequest) => {
        const token = localStorage.getItem('accessToken'); 
        
        try {
            const response = await apiClient.post(
                `/create-url`,
                paymentRequest,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("API Success:", response.data);
            return response.data;

        } catch (error) {
            const serverMessage = error.response?.data?.message || "Lỗi kết nối Server";
            console.error("API Error:", serverMessage);
            throw error; 
        }
    },

    getTransactionHistory: async () => {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');        
        try {
            const response = await apiClient.get(`/history`);
            return response.data;
        } catch (error) {
            const serverMessage = error.response?.data?.message || "Không thể lấy lịch sử giao dịch";
            console.error("History API Error:", serverMessage);
            throw error;
        }
    },

    downloadInvoice: async (paymentId) => {
        const token = localStorage.getItem('accessToken'); 
        
        try {
            const response = await apiClient.get(
                `/invoice/${paymentId}`,
                {
                    responseType: 'blob' 
                }
            );
            return response.data;
        } catch (error) {
            console.error("Download Invoice API Error:", error);
            throw error;
        }
    }
};