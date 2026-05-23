import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/payment`;

export const paymentApi = {
    createPaymentUrl: async (paymentRequest) => {
        const token = localStorage.getItem('accessToken');
        
        try {
            const response = await axios.post(
                `${BASE_URL}/create-url`,
                paymentRequest,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
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
        const token = localStorage.getItem('accessToken');
        
        try {
            const response = await axios.get(
                `${BASE_URL}/history`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
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
            const response = await axios.get(
                `${BASE_URL}/invoice/${paymentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
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