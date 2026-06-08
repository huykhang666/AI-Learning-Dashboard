import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
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

export default function ForgotPasswordModal({ onClose }) {
  const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(`${BASE_API_URL}/api/v1/auth/forgot-password`, {
        email,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra, thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: T.white,
          borderRadius: 16,
          padding: 32,
          width: "100%",
          maxWidth: 400,
          position: "relative",
          fontFamily: F,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: T.textMid,
          }}
        >
          <X size={20} />
        </button>

        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: T.text,
            marginBottom: 8,
          }}
        >
          Quên mật khẩu?
        </h2>
        <p style={{ fontSize: 13, color: T.textMid, marginBottom: 20 }}>
          Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một đường dẫn
          để đặt lại mật khẩu.
        </p>

        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ color: "#16a34a", fontWeight: 600, fontSize: 14 }}>
              ✅ Email đã được gửi! Kiểm tra hộp thư của bạn.
            </p>
            <button
              onClick={onClose}
              style={{
                marginTop: 16,
                padding: "10px 24px",
                borderRadius: 10,
                background: T.primary,
                color: T.white,
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Đóng
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 8,
                  padding: "10px 12px",
                  marginBottom: 12,
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
              Địa chỉ email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: `1.5px solid ${error ? T.danger : T.border}`,
                fontSize: 13,
                outline: "none",
                fontFamily: F,
                boxSizing: "border-box",
                marginBottom: 16,
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
              {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
