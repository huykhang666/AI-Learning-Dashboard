import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { FaBolt, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { userService } from "../../api/UserService";


const SidebarInner = ({ showClose, onMobileClose, usageData, userData }) => {
  const { t } = useTranslation();
  // Kiểm tra trạng thái Premium
  const isPremium = userData?.isPremium;

  return (
    <div className="flex flex-col h-full px-3 py-4 overflow-y-auto relative bg-white">
      {/* Nút đóng trên Mobile */}
      {showClose && (
        <button onClick={onMobileClose} className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-600 p-1">
          <FaTimes size={18} />
        </button>
      )}

      {/* Logo Group */}
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
          <FaBolt size={14} color="orange" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-sm text-gray-800">AI-Learning</span>
          <span className="text-indigo-600 font-bold text-sm">DashBoard</span>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto mt-4">
        {[
          { label: t("sidebar.dashboard"), key: "dashboard", path: "/app/dash" },
          { label: t("sidebar.courses"), key: "courses", path: "/app/courses" },
          { label: t("sidebar.exams", { defaultValue: "Thi Online" }), key: "exams", path: "/app/exams" },
          { label: t("sidebar.history"), key: "history", path: "/app/history" },
          { label: t("sidebar.analytics"), key: "analytics", path: "/app/analytics" },
          {
            label: t("sidebar.premium"),
            key: "premium",
            path: "/app/premium",
            badge: isPremium ? t("sidebar.badges.pro") : t("sidebar.badges.free")
          },
          { label: t("sidebar.help"), key: "help", path: "/app/help" },
        ].map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left
              ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`
            }
          >
            {/* Đổi màu text riêng cho mục Premium/PRO */}
            <span className={item.key === "premium"
              ? (isPremium ? "text-green-600 font-bold" : "text-orange-500 font-bold")
              : ""
            }>
              {item.label}
            </span>

            {item.badge && (
              <span className={`ml-auto text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${isPremium ? "bg-green-500" : "bg-orange-400"
                }`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

    </div>
  );
};

function Sidebar({ onLogout, mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [usageData, setUsageData] = useState({ used: 0, total: 10 });
  const { t } = useTranslation();
  const [userData, setUserData] = useState({ name: t("sidebar.loading"), plan: t("sidebar.plan.free"), avatar: ".." });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);

    const fetchInfo = async () => {
      try {
        const res = await userService.getMyInfo();

        const fullName = `${res.firstname || ''} ${res.lastname || ''}`.trim();

        setUserData({
          fullName: fullName || t("sidebar.default_name"),
          isPremium: res.is_premium === true || res.isPremium === true || res.premium === true,
          plan: (res.is_premium || res.isPremium || res.premium) ? t("sidebar.plan.premium") : t("sidebar.plan.free"),
          avatar: (res.firstname || "U").charAt(0).toUpperCase()
        });

        setUsageData({
          used: Number(res.dailyUploadCount) || 0,
          total: 10
        });
      } catch (err) {
        console.error(t("sidebar.error_loading"), err);
      }
    };
    fetchInfo();

    return () => window.removeEventListener("resize", check);
  }, []);

  const percent = Math.min((usageData.used / usageData.total) * 100, 100);

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