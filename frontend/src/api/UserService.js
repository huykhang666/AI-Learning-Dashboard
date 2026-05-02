import axios from 'axios';

const API_URL = "http://localhost:8080/api/v1/users"; 

export const userService = {
    getMyInfo: async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/my-info`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            return response.data;

        } catch (error) {
            console.error("Lỗi khi gọi API getMyInfo:", error);
            throw error;
        }
    }
};