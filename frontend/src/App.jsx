import { useState } from "react";
import PageLogin from "./pages/Login";
import PageRegister from "./pages/Register";
import Home from "./pages/Home";
function App() {
  const [screen, setScreen] = useState("home"); 

  if (screen === "login") {
    return (
      <PageLogin
        onLogin={() => setScreen("dashboard")}
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
  if (screen === "dashboard") {
    return (
      <div>
        <Dashboar/>
      </div>
    );
  }
  return (
    <div>
      <Home
        onRegister={() => setScreen("register")}
        onLogin={() => setScreen("login")}
      />
    </div>
  );
}

export default App;
