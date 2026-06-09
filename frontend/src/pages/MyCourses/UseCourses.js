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
      let userId = null;
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            window
              .atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const decoded = JSON.parse(jsonPayload);
          userId = decoded.userId || decoded.id || decoded.sub;
        } catch (e) {
          console.error("Error decoding token in useCourses:", e);
        }
      }
      if (!userId) {
        const userStr = localStorage.getItem("user");
        if (userStr && userStr !== "undefined") {
          try {
            const userObj = JSON.parse(userStr);
            userId = userObj.id || userObj.userId;
          } catch (e) {
            console.error("Error parsing user in useCourses:", e);
          }
        }
      }

      const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await axios.get(`${apiBaseUrl}/api/v1/courses`, {
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