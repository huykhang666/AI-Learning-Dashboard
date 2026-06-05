import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const ADMIN_BASE_URL = `${API_URL}/api/v1/admin`;
const USER_BASE_URL = `${API_URL}/api/v1`;

const adminClient = axios.create({
  baseURL: ADMIN_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const userClient = axios.create({
  baseURL: USER_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const attachAuthToken = (config) => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

adminClient.interceptors.request.use(attachAuthToken);
userClient.interceptors.request.use(attachAuthToken);

function unwrapResponse(response) {
  console.log("📦 Response data:", response?.data);
  const result = response?.data?.result ?? response?.data ?? null;
  console.log("✅ Unwrapped result:", result);
  return result;
}

export const adminApi = {
  getDashboardMetrics: async () => {
    const response = await adminClient.get("/dashboard/metrics");
    return unwrapResponse(response);
  },

  getAllUsers: async () => {
    const response = await userClient.get("/users");
    return unwrapResponse(response);
  },

  getAllPayments: async () => {
    const response = await adminClient.get("/payments");
    return unwrapResponse(response);
  },

  getPaymentsPaginated: async (params) => {
    const response = await adminClient.get(`/payments/paginated?${params.toString()}`);
    return unwrapResponse(response);
  },

  deletePayment: async (paymentId) => {
    const response = await adminClient.delete(`/payments/${paymentId}`);
    return unwrapResponse(response);
  },

  updateUser: async (userId, data) => {
    const response = await userClient.put(`/users/${userId}`, data);
    return unwrapResponse(response);
  },

  deleteUser: async (userId) => {
    const response = await userClient.delete(`/users/${userId}`);
    return unwrapResponse(response);
  },

  togglePremium: async (userId, isPremium) => {
    const response = await userClient.patch(`/users/${userId}/premium`, {
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