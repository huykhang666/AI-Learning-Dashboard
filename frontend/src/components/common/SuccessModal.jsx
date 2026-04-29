import { FaCheckCircle } from "react-icons/fa";
const SuccessModal = ({ open, onClose, username }) => {
    if (!open) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999
        }}>
            <div style={{
                background: "#fff",
                padding: "30px",
                borderRadius: "16px",
                width: "320px",
                textAlign: "center",
                animation: "fadeIn .25s ease"
            }}>
                <div
                    style={{
                        width: 70,
                        height: 70,
                        borderRadius: "50%",
                        background: "#DCFCE7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px"
                    }}
                >
                    <FaCheckCircle size={32} color="#16A34A" />
                </div>

                <h2 style={{ margin: "10px 0" }}>
                    Đăng ký thành công!
                </h2>

                <p style={{ fontSize: 13, color: "#64748B" }}>
                    Tài khoản <b>{username}</b> đã được tạo
                </p>

                <button
                    onClick={onClose}
                    style={{
                        marginTop: 20,
                        width: "100%",
                        padding: "10px",
                        borderRadius: 10,
                        border: "none",
                        background: "#2563EB",
                        color: "#fff",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Đăng nhập ngay
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;