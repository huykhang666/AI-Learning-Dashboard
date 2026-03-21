import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import HeroSection from "./components/home/HeroSection";
import PageLogin from "./pages/auth/Login";
import PageRegister from "./pages/auth/Register";
import Feature from "./components/home/Feature";
import Pricing from "./components/home/Pricing";
import About from "./components/home/About";
import FAQ from "./components/home/FAQ";
import Footer from "./components/home/Footer";
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
      <Pricing
        onLogin={() => setScreen("login")}
        onRegister={() => setScreen("register")}
      />
      <About
        onLogin={() => setScreen("login")}
        onRegister={() => setScreen("register")}
      />
      <FAQ
        onLogin={() => setScreen("login")}
        onRegister={() => setScreen("register")}
      />
      <Footer
        onLogin={() => setScreen("login")}
        onRegister={() => setScreen("register")}
      />
    </div>
  );
}

export default App;
