import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuth2RedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 1. Lấy thông tin từ URL (Khớp với link Khang gửi)
        const params = new URLSearchParams(location.search);
        const accessToken = params.get("token"); // Backend dùng chữ 'token'
        const refreshToken = params.get("refreshToken");

        console.log("Đã bắt được Token của Khang! 🚀");

        if (accessToken) {
            // 2. Lưu vào kho (localStorage)
            localStorage.setItem("accessToken", accessToken);
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }
            
            // 3. Chuyển hướng vào Dashboard (Sửa lại path cho đúng logic của Khang)
            // Nếu Khang dùng logic setScreen("app"), hãy gọi hàm đó. 
            // Nếu dùng Router, hãy dùng navigate:
            navigate("/app/dash"); 
        } else {
            navigate("/login");
        }
    }, [location, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>Đang bóc tách Token, đợi mình tí nhé Khang... 🔑</h2>
        </div>
  );
}