import { useState, useEffect } from "react";
import { FaBolt } from "react-icons/fa";
import {
  Eye,
  EyeOff,
  AlertTriangle,
  Mic,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { authService } from "../../api/AuthService";
import SuccessModal from "../../components/common/SuccessModal";

const T = {
  primary: "#2563EB",
  text: "#0F172A",
  textMid: "#64748B",
  border: "#E2E8F0",
  danger: "#EF4444",
  white: "#FFFFFF",
  bg: "#F8FAFF",
};

const F = "'Plus Jakarta Sans', sans-serif";

const GIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const S_LABEL = ["", "Yếu", "Trung bình", "Khá tốt", "Mạnh"];
const S_COLOR = ["", "#EF4444", "#F59E0B", "#84CC16", "#06C16A"];

function calcStrength(p) {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

const Field = ({ label, type = "text", placeholder, value, onChange, error }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 5, fontFamily: F }}>
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 10,
        border: `1.5px solid ${error ? T.danger : T.border}`,
        fontSize: 13,
        outline: "none",
        fontFamily: F,
        color: T.text,
        background: T.white,
        boxSizing: "border-box",
      }}
    />
    {error && (
      <p style={{ fontSize: 11, color: T.danger, marginTop: 3, fontFamily: F, display: "flex", alignItems: "center", gap: 4 }}>
        <AlertTriangle size={11} /> {error}
      </p>
    )}
  </div>
);

const featureItems = [
  { Icon: Mic, text: "AI Whisper bóc băng tự động" },
  { Icon: Sparkles, text: "Tóm tắt nội dung thông minh" },
  { Icon: MessageSquare, text: "Chatbot hỏi đáp theo bài giảng" },
];

const LeftPanel = () => (
  <div style={{
    width: "50%", flexShrink: 0,
    background: "linear-gradient(150deg,#1e3a8a 0%,#2563eb 45%,#38bdf8 100%)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    padding: "40px 44px", position: "relative", overflow: "hidden", boxSizing: "border-box", height: "100vh"
  }}>
    <button
      onClick={() => (window.location.href = "/")}
      style={{
        position: "absolute", top: 20, left: 20,
        display: "flex", alignItems: "center", gap: 6,
        background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)",
        borderRadius: 10, padding: "7px 14px", cursor: "pointer",
        color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: F,
        backdropFilter: "blur(4px)", zIndex: 10
      }}
    >
      ← Quay lại
    </button>

    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36, zIndex: 1 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <FaBolt size={20} color="#F59E0B" />
      </div>
      <span style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>AI-Learning DashBoard</span>
    </div>

    <div style={{ zIndex: 1, textAlign: "center", maxWidth: 340, width: "100%" }}>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        Học thông minh hơn với sức mạnh của AI
        <FaBolt size={22} color="#F59E0B" />
      </h2>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.7, marginBottom: 22 }}>
        Upload video bài giảng, AI tự động bóc băng, tóm tắt và trả lời mọi câu hỏi.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {featureItems.map(({ Icon, text }) => (
          <div key={text} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(255,255,255,.13)", borderRadius: 12,
            padding: "10px 16px", border: "1px solid rgba(255,255,255,.2)", textAlign: "left"
          }}>
            <Icon size={18} color="#fff" style={{ flexShrink: 0 }} />
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{text}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 36 }}>
        {[["2K+", "Người dùng"], ["50K+", "Video xử lý"], ["98%", "Hài lòng"]].map(([v, l]) => (
          <div key={l}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{v}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function PageRegister({ onGoLogin }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "", email: "", dob: "", pass: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agree, setAgree] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 20); }, []);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors({});
  };

  const strength = calcStrength(form.pass);

  const handleGoogleRegister = () => {
    setGLoading(true);
    setTimeout(() => { window.location.href = "http://localhost:8080/oauth2/authorization/google"; }, 1500);
  };

  const handleRegister = async () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Vui lòng nhập họ";
    if (!form.lastName.trim()) e.lastName = "Vui lòng nhập tên";
    if (!form.username.trim()) e.username = "Vui lòng nhập tên đăng nhập";
    if (!form.email) e.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email không hợp lệ";
    if (!form.pass) e.pass = "Vui lòng nhập mật khẩu";
    else if (form.pass.length < 8) e.pass = "Mật khẩu tối thiểu 8 ký tự";
    if (form.confirm !== form.pass) e.confirm = "Mật khẩu không khớp";
    if (!agree) e.agree = "Bạn cần đồng ý với điều khoản";
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      const data = await authService.register({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        password: form.pass,
        dateOfBirth: form.dob || null,
      });

      await new Promise((r) => setTimeout(r, 800));

      if (data.code === 1000) {
        setShowSuccess(true);
      } else {
        setErrors({ apiError: data.message || "Tài khoản đã tồn tại" });
      }
    } catch (error) {
      setErrors({ apiError: error.response?.data?.message || "Không thể kết nối server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: "100vw", height: "100vh", display: "flex", fontFamily: F, overflow: "hidden" }}>
        <LeftPanel />
        <div style={{
          flex: 1, background: T.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "32px 48px", overflowY: "auto",
          opacity: visible ? 1 : 0, transition: "all .25s ease"
        }}>
          <div style={{ width: "100%", maxWidth: 380 }}>

            {/* Lỗi từ API */}
            {errors.apiError && (
              <div style={{
                background: "#FEF2F2", border: `1px solid ${T.danger}`,
                padding: "12px 16px", borderRadius: 10, marginBottom: 20,
                color: T.danger, fontSize: 13, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 10
              }}>
                <AlertTriangle size={18} color={T.danger} style={{ flexShrink: 0 }} />
                <span>
                  {errors.apiError}. Bạn đã có tài khoản?{" "}
                  <span onClick={onGoLogin} style={{ textDecoration: "underline", cursor: "pointer", color: T.primary }}>
                    Đăng nhập ngay
                  </span>
                </span>
              </div>
            )}

            <h1 style={{ fontSize: 24, fontWeight: 800, color: T.text, marginBottom: 4 }}>Tạo tài khoản mới</h1>
            <p style={{ fontSize: 13, color: T.textMid, marginBottom: 20 }}>Bắt đầu hành trình cùng AI-Learning</p>

            {/* Đăng ký Google */}
            <button
              onClick={handleGoogleRegister}
              disabled={gLoading}
              style={{
                width: "100%", padding: 11, borderRadius: 11,
                border: `1.5px solid ${T.border}`, background: T.white,
                cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", gap: 9, fontWeight: 600, fontSize: 14,
                color: T.text, marginBottom: 20
              }}
            >
              {gLoading
                ? <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #ccc", borderTopColor: T.primary, animation: "spin .7s linear infinite" }} />
                : <GIcon />}
              {gLoading ? "Đang kết nối..." : "Đăng ký với Google"}
            </button>

            <div style={{ display: "flex", gap: 12 }}>
              <Field label="Họ & tên đệm" placeholder="Nguyễn Văn" value={form.firstName} onChange={set("firstName")} error={errors.firstName} />
              <Field label="Tên" placeholder="An" value={form.lastName} onChange={set("lastName")} error={errors.lastName} />
            </div>

            <Field label="Tên đăng nhập" placeholder="ten_dang_nhap" value={form.username} onChange={set("username")} error={errors.username} />
            <Field label="Email" type="email" placeholder="example@email.com" value={form.email} onChange={set("email")} error={errors.email} />
            <Field label="Ngày sinh (không bắt buộc)" type="date" value={form.dob} onChange={set("dob")} />

            {/* Mật khẩu + strength indicator */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 5 }}>Mật khẩu</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Tối thiểu 8 ký tự"
                  value={form.pass}
                  onChange={set("pass")}
                  style={{
                    width: "100%", padding: "10px 40px 10px 12px", borderRadius: 10,
                    border: `1.5px solid ${errors.pass ? T.danger : T.border}`,
                    fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: F,
                  }}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: T.textMid }}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.pass && (
                <p style={{ fontSize: 11, color: T.danger, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                  <AlertTriangle size={11} /> {errors.pass}
                </p>
              )}
              {form.pass && (
                <div style={{ marginTop: 5 }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: 2 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? S_COLOR[strength] : T.border }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 10, color: S_COLOR[strength], fontWeight: 700 }}>Độ mạnh: {S_LABEL[strength]}</span>
                </div>
              )}
            </div>

            <Field label="Xác nhận mật khẩu" type="password" placeholder="Nhập lại mật khẩu" value={form.confirm} onChange={set("confirm")} error={errors.confirm} />

            {/* Điều khoản */}
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: errors.agree ? 4 : 20 }}>
              <input type="checkbox" checked={agree} onChange={() => { setAgree(!agree); setErrors({}); }} />
              <span style={{ fontSize: 12, color: T.textMid }}>Tôi đồng ý với các điều khoản dịch vụ</span>
            </label>
            {errors.agree && (
              <p style={{ fontSize: 11, color: T.danger, marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
                <AlertTriangle size={11} /> {errors.agree}
              </p>
            )}

            {/* Nút đăng ký */}
            <button
              onClick={handleRegister}
              disabled={loading}
              style={{
                width: "100%", padding: 12, borderRadius: 11, border: "none",
                background: loading ? "#BFDBFE" : T.primary,
                color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: F,
              }}
            >
              {loading && <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #fff", borderTopColor: "transparent", animation: "spin .7s linear infinite" }} />}
              {loading ? "Đang tạo tài khoản..." : "Đăng ký ngay"}
            </button>

            <p style={{ textAlign: "center", marginTop: 18, marginBottom: 0, fontSize: 13, color: T.textMid, fontWeight: 500 }}>
              Đã có tài khoản?{" "}
              <span onClick={onGoLogin} style={{ color: T.primary, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                Đăng nhập tại đây
              </span>
            </p>
          </div>
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        username={form.username}
        onClose={() => { setShowSuccess(false); onGoLogin(); }}
      />
    </>
  );
}