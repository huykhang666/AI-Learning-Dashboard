// src/pages/dashboard/MyCourses/UseCourses.js
import { useState, useMemo, useEffect } from "react";
import { userService } from "../../api/UserService";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' hoặc 'mine'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const userInfo = await userService.getMyInfo();
        const currentUserId = userInfo.userId; 

        if (currentUserId) {
          const data = await userService.getCourses(currentUserId); 
          setCourses(data);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const filteredCourses = useMemo(() => {
    let result = courses;

    // Fix lại logic lọc tab ở đây
    if (activeTab === "mine") {
      // Chỉ lấy những khóa học đã được mở khóa (đã mua hoặc free)[cite: 7]
      result = result.filter((c) => c.unlocked === true);
    }

    if (searchQuery.trim()) {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [activeTab, searchQuery, courses]);

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filteredCourses,
    loading
  };
}