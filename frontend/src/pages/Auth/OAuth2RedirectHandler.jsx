import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { userService } from "../../api/UserService"; // Khang check lại đường dẫn import này cho đúng nhé

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("token") || params.get("accessToken") || params.get("access_token");
    const refreshToken = params.get("refreshToken") || params.get("refresh_token");

    const handleOAuth2Login = async () => {
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        console.log("Đã bắt được Token! 🚀");

        try {
          const res = await userService.getMyInfo();
          if (res && res.username) {
            localStorage.setItem("username", res.username);
            localStorage.setItem("user", JSON.stringify(res));
          }
          
          const isAdmin = res && (res.role === "ADMIN" || (res.roles && res.roles.includes("ADMIN")));
          if (isAdmin) {
            navigate("/admin");
          } else {
            navigate("/app/dash");
          }
        } catch (err) {
          console.error("Lỗi lấy thông tin user sau OAuth2:", err);
          navigate("/app/dash");
        }
      } else {
        console.log("Không tìm thấy token trên URL, đá về login!");
        navigate("/login");
      }
    };

    handleOAuth2Login();
  }, [location, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="text-center">
        <p className="text-lg font-medium text-slate-600">Đang xử lý đăng nhập bằng Google...</p>
      </div>
    </div>
  );
}