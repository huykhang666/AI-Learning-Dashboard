import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/admin";

const adminClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function unwrapResponse(response) {
  return response?.data?.result ?? response?.data ?? null;
}

export const adminApi = {
  getDashboardMetrics: async () => {
    const response = await adminClient.get("/dashboard/metrics");
    return unwrapResponse(response);
  },

  getAllUsers: async () => {
    const response = await adminClient.get("/users");
    return unwrapResponse(response);
  },

  getAllPayments: async () => {
    const response = await adminClient.get("/payments");
    return unwrapResponse(response);
  },

  updateUser: async (userId, data) => {
    const response = await adminClient.put(`/users/${userId}`, data);
    return unwrapResponse(response);
  },

  deleteUser: async (userId) => {
    const response = await adminClient.delete(`/users/${userId}`);
    return unwrapResponse(response);
  },

  togglePremium: async (userId, isPremium) => {
    const response = await adminClient.patch(`/users/${userId}/premium`, {
      isPremium: isPremium,
    });
    return unwrapResponse(response);
  },

  getUsers: async () => {
    return adminApi.getAllUsers();
  },

  getPayments: async () => {
    return adminApi.getAllPayments();
  },
};