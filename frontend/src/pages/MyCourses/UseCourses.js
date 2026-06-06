import { useState, useMemo, useEffect } from "react";
import axios from "axios"; // Đừng quên import axios nhé

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Lấy thẻ Token trong ví ra
        const token = localStorage.getItem("accessToken"); 

        // Gọi thẳng vào API Tất cả khóa học (thay localhost:8080 nếu cổng của nhóm bạn khác)
        const response = await axios.get("http://localhost:8080/api/v1/courses", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Tùy theo chuẩn API của nhóm, dữ liệu thường nằm trong response.data.result
        const allCourses = response.data.result || response.data || [];
        setCourses(allCourses);

      } catch (error) {
        console.error("Lỗi tải dữ liệu khóa học:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  const filteredCourses = useMemo(() => {
    let result = courses;

    // Nếu chuyển tab "Khóa học của tôi", mới lọc các khóa đã mở khóa
    if (activeTab === "mine") {
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