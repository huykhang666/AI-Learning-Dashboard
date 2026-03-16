import { useState } from "react";

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

const Field = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  right,
}) => (
  <div style={{ marginBottom: 11 }}>
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
      <p style={{ fontSize: 11, color: T.danger, marginTop: 3, fontFamily: F }}>
        ⚠ {error}
      </p>
    )}
  </div>
);

export default function PageRegister({ onRegister, onGoLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    pass: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agree, setAgree] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors({});
  };
  const strength = calcStrength(form.pass);

  const handleRegister = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập họ tên";
    if (!form.email) e.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email không hợp lệ";
    if (!form.pass) e.pass = "Vui lòng nhập mật khẩu";
    else if (form.pass.length < 8) e.pass = "Mật khẩu tối thiểu 8 ký tự";
    if (form.confirm !== form.pass) e.confirm = "Mật khẩu không khớp";
    if (!agree) e.agree = "Bạn cần đồng ý với điều khoản";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1500);
  };

  if (done)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: T.bg,
          fontFamily: F,
        }}
      >
        <div
          style={{
            background: T.white,
            borderRadius: 20,
            border: `1px solid ${T.border}`,
            padding: "44px 40px",
            maxWidth: 420,
            width: "90%",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(37,99,235,.1)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#DCFCE7",
              border: "3px solid #06C16A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              margin: "0 auto 20px",
            }}
          >
            ✅
          </div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              marginBottom: 8,
              color: T.text,
            }}
          >
            Đăng ký thành công! 🎉
          </h2>
          <p
            style={{
              color: T.textMid,
              fontSize: 13,
              lineHeight: 1.75,
              marginBottom: 28,
            }}
          >
            Tài khoản <strong style={{ color: T.text }}>{form.email}</strong> đã
            được tạo.
            <br />
            Chúc bạn học tập hiệu quả!
          </p>
          <button
            onClick={() => onRegister()}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 11,
              border: "none",
              background: T.primary,
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            Bắt đầu học ngay →
          </button>
        </div>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: F }}>
      {/* LEFT */}
      <div
        style={{
          width: "50%",
          background:
            "linear-gradient(150deg,#1e3a8a 0%,#2563eb 45%,#38bdf8 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 44px",
          position: "relative",
          overflow: "hidden",
        }}
      >
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 36,
            zIndex: 1,
            alignSelf: "flex-start",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(255,255,255,.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            ⚡
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>
            AI-Learning DashBoard
          </span>
        </div>

        <div style={{ zIndex: 1, textAlign: "center", maxWidth: 340 }}>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            Học thông minh hơn
            <br />
            với sức mạnh của AI ⚡
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,.8)",
              lineHeight: 1.75,
              marginBottom: 28,
            }}
          >
            Upload video bài giảng, AI tự động bóc băng, tóm tắt và trả lời mọi
            câu hỏi.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 36,
            }}
          >
            {[
              ["🎙", "AI Whisper bóc băng tự động"],
              ["✨", "Tóm tắt nội dung thông minh"],
              ["💬", "Chatbot hỏi đáp theo bài giảng"],
            ].map(([ic, txt]) => (
              <div
                key={txt}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(255,255,255,.13)",
                  borderRadius: 12,
                  padding: "11px 16px",
                  border: "1px solid rgba(255,255,255,.2)",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 18 }}>{ic}</span>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
                  {txt}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 36 }}>
            {[
              ["2K+", "Người dùng"],
              ["50K+", "Video xử lý"],
              ["98%", "Hài lòng"],
            ].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>
                  {v}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,.6)",
                    marginTop: 2,
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — scrollable */}
      <div
        style={{
          width: "50%",
          background: T.bg,
          overflowY: "auto",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "32px 48px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 380, paddingTop: 8 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: T.text,
              marginBottom: 4,
            }}
          >
            Tạo tài khoản mới 🚀
          </h1>
          <p
            style={{
              fontSize: 13,
              color: T.textMid,
              marginBottom: 20,
              fontWeight: 500,
            }}
          >
            Miễn phí. Không cần thẻ tín dụng.
          </p>

          {/* Google */}
          <button
            onClick={() => onRegister()}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: 11,
              border: `1.5px solid ${T.border}`,
              background: T.white,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              fontWeight: 600,
              fontSize: 14,
              color: T.text,
              marginBottom: 18,
              fontFamily: F,
              boxShadow: "0 1px 3px rgba(0,0,0,.06)",
            }}
          >
            <GIcon /> Đăng ký với Google
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontSize: 12, color: T.textLight, fontWeight: 500 }}>
              hoặc tạo tài khoản
            </span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          <Field
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={form.name}
            onChange={set("name")}
            error={errors.name}
          />
          <Field
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
          />

          {/* Password + strength */}
          <div style={{ marginBottom: 11 }}>
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
              Mật khẩu
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Tối thiểu 8 ký tự"
                value={form.pass}
                onChange={set("pass")}
                style={{
                  width: "100%",
                  padding: "10px 36px 10px 12px",
                  borderRadius: 10,
                  border: `1.5px solid ${errors.pass ? T.danger : T.border}`,
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
                  e.target.style.borderColor = errors.pass
                    ? T.danger
                    : T.border;
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  color: T.textLight,
                  padding: 0,
                }}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
            {form.pass && (
              <div style={{ marginTop: 6 }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 3,
                        borderRadius: 2,
                        background:
                          i <= strength ? S_COLOR[strength] : T.border,
                        transition: "background .3s",
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: S_COLOR[strength],
                    fontWeight: 700,
                  }}
                >
                  Độ mạnh: {S_LABEL[strength]}
                </span>
              </div>
            )}
            {errors.pass && (
              <p style={{ fontSize: 11, color: T.danger, marginTop: 3 }}>
                ⚠ {errors.pass}
              </p>
            )}
          </div>

          <Field
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={form.confirm}
            onChange={set("confirm")}
            error={errors.confirm}
          />

          {/* Agree */}
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                cursor: "pointer",
              }}
            >
              <div
                onClick={() => setAgree(!agree)}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  border: `2px solid ${errors.agree ? T.danger : agree ? T.primary : "#CBD5E1"}`,
                  background: agree ? T.primary : T.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  marginTop: 2,
                  transition: "all .15s",
                }}
              >
                {agree && (
                  <span
                    style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}
                  >
                    ✓
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: T.textMid,
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                Tôi đồng ý với{" "}
                <span
                  style={{
                    color: T.primary,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Điều khoản dịch vụ
                </span>{" "}
                và{" "}
                <span
                  style={{
                    color: T.primary,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Chính sách bảo mật
                </span>
              </span>
            </label>
            {errors.agree && (
              <p
                style={{
                  fontSize: 11,
                  color: T.danger,
                  marginTop: 3,
                  paddingLeft: 24,
                }}
              >
                ⚠ {errors.agree}
              </p>
            )}
          </div>

          <button
            onClick={handleRegister}
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
            {loading ? "Đang tạo tài khoản..." : "Đăng ký miễn phí"}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: 16,
              marginBottom: 24,
              fontSize: 13,
              color: T.textMid,
              fontWeight: 500,
            }}
          >
            Đã có tài khoản?{" "}
            <span
              onClick={onGoLogin}
              style={{ color: T.primary, fontWeight: 700, cursor: "pointer" }}
            >
              Đăng nhập
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
