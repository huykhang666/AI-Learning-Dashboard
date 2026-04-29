const BASE_URL = "http://localhost:8080/api/v1/users";

export const authService = {
    login: async (username, password) => {
        const response = await fetch(`http://localhost:8080/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        return response.json();
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