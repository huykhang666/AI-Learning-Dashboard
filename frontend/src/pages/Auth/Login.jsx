import { useState, useEffect } from "react";
import { FaBolt } from "react-icons/fa";
import {
  Mic,
  Sparkles,
  MessageSquare,
  Eye,
  EyeOff,
  AlertTriangle,
  Check,
} from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const T = {
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  text: "#0F172A",
  textMid: "#64748B",
  textLight: "#94A3B8",
  border: "#E2E8F0",
  danger: "#EF4444",
  white: "#FFFFFF",
  bg: "#F8FAFF",
};
const F = "'Plus Jakarta Sans', sans-serif";

const GIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const Field = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  right,
}) => (
  <div style={{ marginBottom: 12 }}>
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 700,
        color: T.text,
        marginBottom: 5,
        fontFamily: F,
      }}
    >
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "10px 36px 10px 12px",
          borderRadius: 10,
          border: `1.5px solid ${error ? T.danger : T.border}`,
          fontSize: 13,
          outline: "none",
          fontFamily: F,
          color: T.text,
          background: T.white,
          boxSizing: "border-box",
          transition: "border-color .15s, box-shadow .15s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = T.primary;
          e.target.style.boxShadow = `0 0 0 3px ${T.primary}18`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? T.danger : T.border;
          e.target.style.boxShadow = "none";
        }}
      />
      {right && (
        <span
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {right}
        </span>
      )}
    </div>
    {error && (
      <p
        style={{
          fontSize: 11,
          color: T.danger,
          marginTop: 3,
          fontFamily: F,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <AlertTriangle size={11} /> {error}
      </p>
    )}
  </div>
);

export default function PageLogin({ onLogin, onGoRegister, onAdminLogin }) {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [remember, setRemember] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 20);
  }, []);

  const handleGoRegister = () => {
    setVisible(false);
    setTimeout(() => onGoRegister(), 250);
  };

  const [gLoading, setGLoading] = useState(false);

  const handleGoogleLogin = () => {
    setGLoading(true);
    setTimeout(() => {
      window.location.href =
        "http://localhost:8080/oauth2/authorization/google";
    }, 1500);
  };

  const handleLogin = async () => {
    const e = {};
    if (!username) e.username = "Vui lòng nhập username";
    if (!pass) e.pass = "Vui lòng nhập mật khẩu";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);
    try {
      const delay = new Promise((resolve) => setTimeout(resolve, 1200));
      const apiCall = fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: pass }),
      });

      const [response] = await Promise.all([apiCall, delay]);
      const data = await response.json();

      if (response.ok && data.code === 1000) {
        localStorage.setItem("accessToken", data.result.token);
        localStorage.setItem("refreshToken", data.result.refreshToken);

        try {
          const decoded = jwtDecode(data.result.token);
          const autoId = decoded.userId || decoded.id || decoded.sub;
          if (autoId) {
            localStorage.setItem("user", JSON.stringify({ id: autoId }));
          }
        } catch (decodeErr) {
          console.warn("Không decode được token:", decodeErr);
        }

        onLogin();
      } else {
        setErrors({
          username: data.message || "Tài khoản hoặc mật khẩu không đúng!",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ username: "Không thể kết nối tới Server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div
        className="min-h-screen w-screen flex flex-col md:flex-row overflow-hidden"
        style={{ fontFamily: F }}
      >
        {/* LEFT */}
        <div
          className="hidden md:flex md:w-1/2 flex-col items-center justify-center relative overflow-hidden p-10 lg:p-12 h-screen"
          style={{
            background:
              "linear-gradient(150deg,#1e3a8a 0%,#2563eb 45%,#38bdf8 100%)",
          }}
        >
          <button
            className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25 z-10"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            ← Quay lại
          </button>
          <div
            style={{
              position: "absolute",
              top: -80,
              left: -80,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "rgba(255,255,255,.06)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              right: -60,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: "rgba(56,189,248,.15)",
            }}
          />
          <div className="flex items-center gap-2.5 mb-9 z-10 self-center">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(255,255,255,.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaBolt size={20} color="#F59E0B" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>
              AI-Learning DashBoard
            </span>
          </div>
          <div className="z-10 text-center max-w-[340px] w-full">
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-2">
              Học thông minh hơn
              <br />
              với sức mạnh của AI{" "}
              <FaBolt
                size={22}
                color="#F59E0B"
                style={{ verticalAlign: "middle", display: "inline" }}
              />
            </h2>
            <p className="text-sm text-white/80 leading-relaxed mb-6">
              Upload video bài giảng, AI tự động bóc băng, tóm tắt và trả lời
              mọi câu hỏi.
            </p>
            <div className="flex flex-col gap-2.5 mb-7">
              {[
                [Mic, "AI Whisper bóc băng tự động"],
                [Sparkles, "Tóm tắt nội dung thông minh"],
                [MessageSquare, "Chatbot hỏi đáp theo bài giảng"],
              ].map(([Icon, txt]) => (
                <div
                  key={txt}
                  className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3"
                >
                  <Icon size={18} color="#fff" />
                  <span className="text-sm font-semibold text-white">
                    {txt}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                ["2K+", "Người dùng"],
                ["50K+", "Video xử lý"],
                ["98%", "Hài lòng"],
              ].map(([v, l]) => (
                <div key={l} className="min-w-[90px] text-center">
                  <div className="text-2xl font-black text-white">{v}</div>
                  <div className="text-xs text-white/70 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — fade in */}
        <div
          className="w-full md:w-1/2 flex-1 min-w-0 bg-[#f8faff] flex items-center justify-center p-8 md:p-12 overflow-y-auto transition duration-300 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
          }}
        >
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
              Chào mừng trở lại!
            </h1>
            <p className="text-sm text-slate-500 font-medium mb-6">
              Đăng nhập để tiếp tục hành trình học tập
            </p>
            <button
              onClick={handleGoogleLogin}
              disabled={gLoading}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition duration-200 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-3 mb-5"
            >
              {}
              {gLoading ? (
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: `2px solid ${T.border}`,
                    borderTopColor: T.primary,
                    animation: "spin .7s linear infinite",
                  }}
                />
              ) : (
                <GIcon />
              )}

              {gLoading ? "Đang kết nối Google..." : "Đăng nhập với Google"}
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-xs text-slate-400 uppercase tracking-[0.16em]">
                hoặc đăng nhập với email
              </span>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
            <Field
              label="Username"
              type="text"
              placeholder="Nhập username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors({});
              }}
              error={errors.username}
            />
            <Field
              label="Mật khẩu"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setErrors({});
              }}
              error={errors.pass}
              right={
                <button
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    color: T.textLight,
                    padding: 0,
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  cursor: "pointer",
                }}
              >
                <div
                  onClick={() => setRemember(!remember)}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: `2px solid ${remember ? T.primary : "#CBD5E1"}`,
                    background: remember ? T.primary : T.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  {remember && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
                <span
                  style={{ fontSize: 12, color: T.textMid, fontWeight: 500 }}
                >
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <span
                style={{
                  fontSize: 12,
                  color: T.primary,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Quên mật khẩu?
              </span>
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 11,
                border: "none",
                background: loading ? "#BFDBFE" : T.primary,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: F,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: loading ? "none" : `0 4px 14px ${T.primary}40`,
                transition: "background .2s",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = T.primaryHover;
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = T.primary;
              }}
            >
              {loading && (
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,.4)",
                    borderTopColor: "#fff",
                    animation: "spin .7s linear infinite",
                  }}
                />
              )}
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <p
              style={{
                textAlign: "center",
                marginTop: 18,
                marginBottom: 0,
                fontSize: 13,
                color: T.textMid,
                fontWeight: 500,
              }}
            >
              Chưa có tài khoản?{" "}
              <span
                onClick={handleGoRegister}
                style={{ color: T.primary, fontWeight: 700, cursor: "pointer" }}
              >
                Đăng ký ngay
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
