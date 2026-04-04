import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuth2RedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get("token"); 
        const refreshToken = params.get("refreshToken");

        console.log("Đã bắt được Token của Khang! 🚀");

        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }
            
    
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