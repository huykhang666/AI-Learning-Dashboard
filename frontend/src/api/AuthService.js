const BASE_URL = "http://localhost:8080/api/v1/users";

export const authService = {
    login: async (username, password) => {
        const response = await fetch(`http://localhost:8080/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        // ✅ Lưu token ngay sau khi login thành công
        if (data.code === 1000 && data.result) {
            localStorage.setItem('accessToken', data.result.accessToken);
            localStorage.setItem('refreshToken', data.result.refreshToken);
        }

        return data;
    },

    register: async (userData) => {
        const response = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Register failed");
        }

        return data;
    }
};