import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Layout & UI
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Header from "./components/layout/header";

// Pages
import LandingPage from "./pages/Home";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import DashboardPage from "./pages/dashboard/Dashboard";
import OAuth2RedirectHandler from "./pages/Auth/OAuth2RedirectHandler";

function AppRoutes() {
  const navigate = useNavigate();
  const [isPremium, setPremium] = useState(false);
  const [videoUsed, setVideoUsed] = useState(3);

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
      
      <Route
        path="/app/*"
        element={
          <div className="flex" style={{ minHeight: "100vh", background: "#F4F7FE" }}>
            <Sidebar onLogout={handleLogout} />
            <div style={{ flex: 1 }}>
              <Header/>
              <Routes>
                <Route path="dash" element={<DashboardPage />} />
                <Route path="*" element={<Navigate to="dash" />} />
              </Routes>
            </div>
          </div>
        }
      />
      
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