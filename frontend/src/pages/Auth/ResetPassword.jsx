import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AlertTriangle, Eye, EyeOff, CheckCircle } from "lucide-react";
import axios from "axios";

const T = {
  primary: "#2563EB",
  text: "#0F172A",
  textMid: "#64748B",
  border: "#E2E8F0",
  danger: "#EF4444",
  white: "#FFFFFF",
};
const F = "'Plus Jakarta Sans', sans-serif";

export default function ResetPassword() {
  const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token không hợp lệ!");
    }
  }, [token]);

  const handleSubmit = async () => {
    if (!newPassword) {
      setError("Vui lòng nhập mật khẩu mới");
      return;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.post(`${BASE_API_URL}/api/v1/auth/reset-password`, {
        token,
        newPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F8FAFF",
        fontFamily: F,
      }}
    >
      <div
        style={{
          background: T.white,
          borderRadius: 16,
          padding: 40,
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        {success ? (
          <div style={{ textAlign: "center" }}>
            <CheckCircle
              size={48}
              color="#16a34a"
              style={{ marginBottom: 16 }}
            />
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: T.text,
                marginBottom: 8,
              }}
            >
              Đặt lại mật khẩu thành công!
            </h2>
            <p style={{ fontSize: 13, color: T.textMid, marginBottom: 24 }}>
              Bạn có thể đăng nhập với mật khẩu mới.
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "12px 32px",
                borderRadius: 10,
                background: T.primary,
                color: T.white,
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Đăng nhập
            </button>
          </div>
        ) : (
          <>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: T.text,
                marginBottom: 8,
              }}
            >
              Đặt lại mật khẩu
            </h2>
            <p style={{ fontSize: 13, color: T.textMid, marginBottom: 24 }}>
              Nhập mật khẩu mới của bạn bên dưới.
            </p>

            {error && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 8,
                  padding: "10px 12px",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: T.danger,
                  fontSize: 13,
                }}
              >
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.text,
                display: "block",
                marginBottom: 5,
              }}
            >
              Mật khẩu mới
            </label>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                style={{
                  width: "100%",
                  padding: "10px 36px 10px 12px",
                  borderRadius: 10,
                  border: `1.5px solid ${T.border}`,
                  fontSize: 13,
                  outline: "none",
                  fontFamily: F,
                  boxSizing: "border-box",
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
                  color: T.textMid,
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.text,
                display: "block",
                marginBottom: 5,
              }}
            >
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: `1.5px solid ${T.border}`,
                fontSize: 13,
                outline: "none",
                fontFamily: F,
                boxSizing: "border-box",
                marginBottom: 24,
              }}
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: loading ? "#BFDBFE" : T.primary,
                color: T.white,
                fontWeight: 700,
                fontSize: 14,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: F,
              }}
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
