import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import HeroSection from "./components/home/HeroSection";
import PageLogin from "./pages/auth/Login";
import PageRegister from "./pages/auth/Register";
import Feature from "./components/home/Feature";
function App() {
  const [screen, setScreen] = useState("home"); // "home" | "login" | "register"

  if (screen === "login") {
    return (
      <PageLogin
        onLogin={() => setScreen("home")}
        onGoRegister={() => setScreen("register")}
        onAdminLogin={() => setScreen("home")}
      />
    );
  }

  if (screen === "register") {
    return (
      <PageRegister
        onRegister={() => setScreen("home")}
        onGoLogin={() => setScreen("login")}
      />
    );
  }

  return (
    <div>
      <Navbar
        onLogin={() => setScreen("login")}
        onRegister={() => setScreen("register")}
      />
      <HeroSection
        onLogin={() => setScreen("login")}
        onRegister={() => setScreen("register")}
      />
      <Feature
        onLogin={() => setScreen("login")}
        onRegister={() => setScreen("register")}
      />
    </div>
  );
}

export default App;
