import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

export const fetchDashboardData = async () => {
    try {
        const token = localStorage.getItem('token'); 
        console.log("🚀 Đang gọi API với Token:", token);

        const response = await axios.get(`${BASE_URL}/analytics/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });

        console.log("✅ Dữ liệu thật từ Java:", response.data);
        const res = response.data.result;

        const hours = Math.floor(res.totalHours || 0);
        const minutes = Math.round(((res.totalHours || 0) - hours) * 60);
        
        return {
            user: { 
                fullName: res.fullname || res.fullName || "User" 
            }, 
            overview: {
                totalStudyTime: `${hours}h ${minutes}m`,
                lecturesDone: res.totalLectures || 0,
                goalProgress: Math.min(Math.round(((res.totalHours || 0) / (res.weekGoal || 10)) * 100), 100)
            },
            weeklyActivity: (res.weeklyProgress || []).map(p => ({
                day: p.day ? p.day.substring(0, 2) : "??", 
                hours: p.hours || 0,
                active: p.day === new Date().toLocaleDateString('en-US', { weekday: 'short' })
            })),
            topKeywords: res.topKeywords || [],
            recentCourses: [] 
        };
    } catch (error) {
        console.error("❌ Lỗi API thật:", error.response?.status, error.message);
        throw error;
    }
};