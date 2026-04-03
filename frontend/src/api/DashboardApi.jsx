// 1. Dữ liệu giả lập (Mock Data) đóng vai trò như Database của Backend
const mockApiResponse = {
    user: {
      fullName: "Nguyễn Huy Khang",
    },
    overview: {
      totalStudyTime: "1h 23m",
      lecturesDone: 27,
      goalProgress: 60
    },
    weeklyActivity: [
      { day: 'Mo', hours: 1, active: false },
      { day: 'Tu', hours: 1.5, active: false },
      { day: 'We', hours: 0.5, active: false },
      { day: 'Th', hours: 2, active: false },
      { day: 'Fr', hours: 3, active: false },
      { day: 'Sa', hours: 4.5, active: true },
      { day: 'Su', hours: 1.2, active: false },
    ],
    topKeywords: [
      "#Algorithms", "#GraphTheory", "#Dictions", "#GraphTheory"
    ],
    recentCourses: [
      {
        id: 1,
        title: "Discrete Math - Complete Course",
        lessons: 13,
        progress: 75,
        iconColor: "bg-[#3b82f6]",
        iconText: "1234"
      },
      {
        id: 2,
        title: "AI Fundamental",
        lessons: 5,
        progress: 75,
        iconColor: "bg-[#e9d5ff]", // purple-100 equivalent
        iconText: "🤖"
      },
      {
        id: 3,
        title: "Discrete Math - Fundamental",
        lessons: 10,
        progress: 60,
        iconColor: "bg-[#e2e8f0]", // slate-200 equivalent
        iconText: "📐"
      }
    ]
  };
  
  // 2. Hàm gọi API
  export const fetchDashboardData = async () => {
      // Giả lập thời gian chờ của mạng (0.5 giây)
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(mockApiResponse);
          }, 500);
      });
  
      // --- HƯỚNG DẪN SAU NÀY KHI CÓ BACKEND ---
      // Khi có API thật, bạn xóa hàm Promise ở trên và dùng đoạn code dưới đây:
      /*
      try {
          const response = await axios.get('https://your-domain.com/api/dashboard');
          return response.data;
      } catch (error) {
          console.error("Lỗi lấy dữ liệu Dashboard:", error);
          throw error;
      }
      */
  };