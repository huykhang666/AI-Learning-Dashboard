import axios from "axios";

const examClient = axios.create({
  baseURL: "http://localhost:8081/api",
});

examClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const examApi = {
  getExams: async () => {
    const res = await examClient.get("/exams?size=1000");
    return res.data;
  },
  getExamDetail: async (id) => {
    const res = await examClient.get(`/exams/${id}`);
    return res.data;
  },
  submitExam: async (id, payload) => {
    const res = await examClient.post(`/exams/${id}/submit`, payload);
    return res.data;
  }
};
