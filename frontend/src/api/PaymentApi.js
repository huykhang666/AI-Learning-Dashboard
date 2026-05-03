import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/payment';

export const paymentApi = {
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
    }
};