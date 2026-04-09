import MyCourses from "./pages/MyCourses/MyCourses.jsx";
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/header";
import LandingPage from "./pages/Home";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import DashboardPage from "./pages/dashboard/Dashboard";
import OAuth2RedirectHandler from "./pages/Auth/OAuth2RedirectHandler";
import HistoryPage from "./pages/history/History";
import PremiumPage from "./pages/Premium/Premium";
import SettingPage from "./pages/Setting/Setting";
import AnalyticsPage from "./pages/analytics/Analytics";

function AppLayout({ onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    // overflow-hidden để chặn sidebar mobile tràn ngang
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        onLogout={onLogout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Cột phải: header + content, scroll dọc bình thường */}
      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
        <Header onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1">
          <Routes>
            <Route path="dash" element={<DashboardPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="premium" element={<PremiumPage />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="settings" element={<SettingPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="dash" />} />
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
