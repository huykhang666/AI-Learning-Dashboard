import MyCourses from "./pages/MyCourses/MyCourses.jsx";
import { useState, useEffect } from "react"; 
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
import AdminRoute from "./routes/AdminRoute.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import PaymentManagement from "./pages/admin/PaymentManagement.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import webSocketService from "./api/WebSocketService.js";


function AppLayout({ onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    
    let username = localStorage.getItem("username");
    if (!username) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          username = userObj.username;
        } catch (e) {
          console.error("Không thể parse thông tin user từ localStorage", e);
        }
      }
    }

    if (token && username) {
      webSocketService.connect(token, () => {
        console.log(`✉️ WebSocket kết nối thành công! Đang lắng nghe user: ${username}`);

        const notificationTopic = `/user/${username}/queue/notifications`;

        webSocketService.subscribe(notificationTopic, (data) => {
          console.log("Nhận thông báo realtime mới tinh từ Backend:", data);

          if (data.message) {
            toast.success(data.message, {
              position: "top-right",
              autoClose: 5000,
            });
          }

         
          const wsEvent = new CustomEvent("ws-notification", { detail: data });
          window.dispatchEvent(wsEvent);
        });
      });
    }

    return () => {
      webSocketService.disconnect();
    };
  }, []);

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
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
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

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout onLogout={handleLogout} />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="payments" element={<PaymentManagement />} />
      </Route>
      
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
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />
    </BrowserRouter>
  );
}