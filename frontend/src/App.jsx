import MyCourses from "./pages/MyCourses/MyCourses.jsx";
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import LandingPage from "./pages/Home";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import DashboardPage from "./pages/dashboard/Dashboard";
import OAuth2RedirectHandler from "./pages/Auth/OAuth2RedirectHandler";
import HistoryPage from "./pages/History/History";
import PremiumPage from "./pages/Premium/Premium";
import SettingPage from "./pages/Setting/Setting";
import AnalyticsPage from "./pages/analytics/Analytics";
import HelpCenter from "./pages/HelpCenter/HelpCenter";
import CourseDetail from "./pages/CourseDetail/CourseDetail";

function AppLayout({ onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  
  // Kiểm tra chính xác xem có phải đang ở trang chi tiết không
  // Dùng regex để đảm bảo đúng định dạng /app/history/123
  const isCourseDetail = location.pathname.includes("/history/") && location.pathname.split("/").length > 3;

  // Nếu là trang chi tiết, render một layout đơn giản nhất (không Sidebar, không Header chung)
  if (isCourseDetail) {
    return (
      <div className="h-screen w-full overflow-hidden bg-white">
        <main className="h-full w-full">
          <Routes>
            <Route path="history/:id" element={<CourseDetail />} />
          </Routes>
        </main>
      </div>
    );
  }

  // Ngược lại, render Layout Dashboard bình thường có Sidebar và Header
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        onLogout={onLogout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuOpen={() => setMobileOpen(true)} />
        
        {/* Khu vực nội dung có scroll dọc cho Dashboard, History... */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="dash" element={<DashboardPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="premium" element={<PremiumPage />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="settings" element={<SettingPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="help" element={<HelpCenter />} />
            {/* Dự phòng để không bị lỗi nếu path có /history/:id nhưng logic trên lọt lưới */}
            <Route path="history/:id" element={<CourseDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            onLogin={() => navigate("/login")}
            onRegister={() => navigate("/register")}
          />
        }
      />
      <Route
        path="/login"
        element={
          <LoginPage
            onLogin={() => navigate("/app/dash")}
            onGoRegister={() => navigate("/register")}
          />
        }
      />
      <Route
        path="/register"
        element={
          <RegisterPage
            onRegister={() => navigate("/app/dash")}
            onGoLogin={() => navigate("/login")}
          />
        }
      />
      <Route path="/oauth2/callback" element={<OAuth2RedirectHandler />} />
      <Route path="/app/*" element={<AppLayout onLogout={handleLogout} />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="analytics" element={<AnalyticsPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
