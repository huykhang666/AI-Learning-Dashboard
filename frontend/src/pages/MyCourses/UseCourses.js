import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");
      const userId = userStr ? JSON.parse(userStr).userId : null; // ← Fix lỗi 'userId is not defined'

      const response = await axios.get("http://localhost:8080/api/v1/courses", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { userId } // ← Giờ userId đã được khai báo ở trên
      });

      const allCourses = response.data.result || response.data || [];
      setCourses(allCourses);

    } catch (error) {
      console.error("Lỗi tải dữ liệu khóa học:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [location.state]); // ← Reload khi vừa enroll xong và navigate về

  const filteredCourses = useMemo(() => {
    let result = courses;

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