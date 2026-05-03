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
import PaymentSuccessPage from "./pages/Payment/PaymentSuccess.jsx";
import PaymentFailedPage from "./pages/Payment/PaymentFailed.jsx";
import CourseLanding from "./pages/MyCourses/CourseLanding.jsx";

// 1. AppLayout: Chỉ chứa các Route cần Sidebar và Header
function AppLayout({ onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isCourseDetail =
    location.pathname.includes("/history/") &&
    location.pathname.split("/").length > 3;

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

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar dùng onLogout nhận từ props */}
      <Sidebar
        onLogout={onLogout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuOpen={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="dash" element={<DashboardPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="premium" element={<PremiumPage />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="settings" element={<SettingPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="help" element={<HelpCenter />} />
            <Route path="courses/:courseId" element={<CourseLanding />} />
            {/* Route này để hỗ trợ điều hướng trong nội bộ main */}
            <Route path="history/:id" element={<CourseDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// 2. AppRoutes: Chứa các Route chính của ứng dụng
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

      {/* Các Route thanh toán nằm ở ngoài AppLayout để hiển thị Full màn hình */}
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/payment/failed" element={<PaymentFailedPage />} />
      
      <Route path="/oauth2/callback" element={<OAuth2RedirectHandler />} />
      
      {/* Route chính dẫn vào Dashboard Layout */}
      <Route path="/app/*" element={<AppLayout onLogout={handleLogout} />} />
      
      <Route path="*" element={<Navigate to="/" />} />
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