import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/payment';

export const paymentApi = {
    // 1. Hàm tạo URL thanh toán (Giữ nguyên vẹn của Khang)
    createPaymentUrl: async (paymentRequest) => {
        const token = localStorage.getItem('accessToken');
        
        try {
            const response = await axios.post(
                `${BASE_URL}/create-url`,
                paymentRequest, // Body: { userId, amount, planType, gateway }
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

    // 🌟 2. HÀM MỚI: Lấy danh sách lịch sử giao dịch nạp Premium
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

    // 🌟 3. HÀM MỚI: Gọi endpoint tải file PDF hóa đơn dạng Blob stream
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