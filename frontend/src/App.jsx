import { useState } from "react";
<<<<<<< HEAD
import PageLogin from "./pages/Login";
import PageRegister from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/dashboard/Dashboard"
import Sidebar from "./components/layout/Sidebar";
function App() {
  const [screen, setScreen] = useState("dashboard"); 
=======
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
>>>>>>> db7f452 (feat: Add API login Frontend)

// Layout & UI
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

// Pages
import LandingPage from "./pages/Home";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import DashboardPage from "./pages/dashboard/Dashboard";
import OAuth2RedirectHandler from "./pages/Auth/OAuth2RedirectHandler"; 

const FREE_LIMIT = 4;

function AppRoutes() {
  const navigate = useNavigate();
  const [nav, setNav] = useState("dash");
  const [isPremium, setPremium] = useState(false);
  const [videoUsed, setVideoUsed] = useState(3);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

<<<<<<< HEAD
  if (screen === "register") {
    return (
      <PageRegister
        onRegister={() => setScreen("home")}
        onGoLogin={() => setScreen("login")}
      />
    );
  }
  if (screen === "dashboard") {
    return (
      <div className="flex">
        <Sidebar onLogout={() => setScreen("home")} />
        <Dashboard />
    </div>
    );
  }
=======
>>>>>>> db7f452 (feat: Add API login Frontend)
  return (
    <Routes>
      <Route path="/" element={<LandingPage onLogin={() => navigate("/login")} onRegister={() => navigate("/register")} />} />
      <Route path="/login" element={<LoginPage onLogin={() => navigate("/app/dash")} onGoRegister={() => navigate("/register")} />} />
      <Route path="/register" element={<RegisterPage onRegister={() => navigate("/app/dash")} onGoLogin={() => navigate("/login")} />} />
      <Route path="/oauth2/callback" element={<OAuth2RedirectHandler />} />
      <Route path="/app/*" element={
        <div style={{ minHeight: "100vh", background: "#F4F7FE" }}>
          <Routes>
            <Route path="dash" element={<DashboardPage />} />
          </Routes>
        </div>
      } />
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