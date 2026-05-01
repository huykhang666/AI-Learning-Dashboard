import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { FaBolt, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { userService } from "../../api/UserService";


const SidebarInner = ({ showClose, onMobileClose, onLogout, usageData, userData }) => (
  <div className="flex flex-col h-full px-3 py-4 overflow-y-auto relative">
    {showClose && (
      <button onClick={onMobileClose} className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-600 p-1">
        <FaTimes size={18} />
      </button>
    )}

    <div className="flex items-center gap-2 mb-2">
      <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
        <FaBolt size={14} color="orange" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-bold text-sm text-gray-800">AI-Learning</span>
        <span className="text-indigo-600 font-bold text-sm">DashBoard</span>
      </div>
    </div>

    <hr className="border-gray-200 mb-4" />

    <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
      {[
        { label: "Dashboard", key: "dashboard", path: "/app/dash" },
        { label: "MyCourses", key: "courses", path: "/app/courses" },
        { label: "Lịch sử", key: "History", path: "/app/history" },
        { label: "Analytics", key: "analytics", path: "/app/analytics" },
        { label: "Premium", key: "premium", badge: "FREE", path: "/app/premium" },
        { label: "Settings", key: "settings", path: "/app/settings" },
        { label: "Help Center", key: "help", path: "/app/help" },
      ].map((item) => (
        <NavLink
          key={item.key}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left
            ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`
          }
        >
          <span className={item.key === "premium" ? "text-orange-500 font-bold" : ""}>{item.label}</span>
          {item.badge && (
            <span className="ml-auto bg-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
          )}
        </NavLink>
      ))}
    </nav>

    {/* Sidebar.jsx */}
    {/* Trong SidebarInner */}
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl py-3 px-4 flex flex-col gap-3 mb-4 mt-4">
      <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
        <FaBolt size={14} color="orange" />
        {/* Hiển thị số lượng thực tế từ backend */}
        <span>Dùng {usageData.used}/{usageData.total} video</span>
      </div>

      <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-in-out ${usageData.used >= usageData.total ? "bg-red-500" : "bg-blue-600"
            }`}
          style={{
            width: `${Math.min((Number(usageData.used) / Number(usageData.total)) * 100, 100)}%`
          }}
        />
      </div>

      {/* Khi click vào đây nên dẫn tới trang Premium */}
      <NavLink
        to="/app/premium"
        className="w-full bg-blue-600 text-white rounded-lg py-2 font-bold text-sm text-center hover:bg-blue-700 transition-colors"
      >
        Nâng cấp Premium
      </NavLink>
    </div>

    <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
          {userData.avatar}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-gray-800 truncate">{userData.name}</span>
          <span className="text-xs text-gray-500">{userData.plan}</span>
        </div>
      </div>
      <button onClick={onLogout} className="flex items-center justify-center gap-2 w-full border border-gray-200 rounded-xl py-2 text-red-500 text-sm font-bold hover:bg-red-50 transition">
        <FaSignOutAlt /> Đăng xuất
      </button>
    </div>
  </div>
);

function Sidebar({ onLogout, mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // FIX: Thay data tĩnh bằng state để nhận dữ liệu từ API
  const [usageData, setUsageData] = useState({ used: 0, total: 4 });
  const [userData, setUserData] = useState({ name: "Đang tải...", plan: "Free Plan", avatar: ".." });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);

    // FIX: Gọi API để lấy thông tin thực tế
    const fetchInfo = async () => {
      try {
        const res = await userService.getMyInfo();
        setUserData({
          name: res.fullName || "USER",
          plan: res.premium ? "Premium Plan" : "Free Plan",
          avatar: (res.fullName || "U").substring(0, 2).toUpperCase()
        });
        setUsageData({
          used: Number(res.dailyUploadCount) || 0,
          total: 4
        });
      } catch (err) {
        console.error("Lỗi sidebar:", err);
      }
    };
    fetchInfo();

    return () => window.removeEventListener("resize", check);
  }, []);

  // FIX: Đảm bảo phần trăm không vượt quá 100% để tránh lỗi giao diện
  const percent = Math.min((usageData.used / usageData.total) * 100, 100);

  // DESKTOP: sidebar tĩnh trong flex layout
  if (!isMobile) {
    return (
      <aside className="w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100 overflow-y-auto">
        <SidebarInner
          showClose={false}
          onMobileClose={onMobileClose}
          onLogout={onLogout}
          usageData={usageData}
          userData={userData}
        />
      </aside>
    );
  }

  // MOBILE: chỉ render khi mobileOpen=true
  return (
    <>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={onMobileClose} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 overflow-y-auto">
            <SidebarInner
              showClose={true}
              onMobileClose={onMobileClose}
              onLogout={onLogout}
              usageData={usageData}
              userData={userData}
            />
          </aside>
        </>
      )}
    </>
  );
}

export default Sidebar;