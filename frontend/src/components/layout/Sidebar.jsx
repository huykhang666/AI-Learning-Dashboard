import { useState } from "react"
import { FaBolt, FaSignOutAlt } from "react-icons/fa";
import Dashboard from "../../pages/dashboard/Dashboard"
import { NavLink } from "react-router-dom";

function Sidebar({ onLogout }) {
    const [active, setActive] = useState("dashboard");
    const usageData = { used:3, total: 4};
    const percent = (usageData.used / usageData.total) * 100;
    const userData = {
        name: "NGUYỄN HUY KHANG",
        plan: "Free Plan",
        avatar: "NK" // Chữ cái đầu để làm ảnh đại diện
    };
    const menuItems = [
        { label: "Dashboard", key: "dashboard", path: "/app/dash"},
        { label: "MyCourses", key: "courses", path: "/app/courses"},
        { label: "Lịch sử", key: "History", path : "/app/history"},
        { label: "Analytics", key: "analytics", path: "/app/analytics"},
        { label: "Premium", key: "premium", path: "/app/premium", badge: "FREE"},
        { label: "Settings", key: "settings", path: "/app/settings"},
        { label: "Help Center", key: "help", path: "/app/help"},
    ]
    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col px-3 py-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                    <FaBolt size={14} color="orange" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-sm leading-normal">AI-Learning</span>
                    <span className="text-indigo-600 font-bold text-sm leading-normal">DashBoard</span>
                </div>
            </div>
            <hr className=" border-gray-500 border mb-2"/>
            <nav className="flex flex-col gap-1 flex-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.key}
                        to={item.path || `/app/${item.key}`}
                        className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition w-full text-left 
                        ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`
                        }
                    >
                        <span className={item.key === "premium" ? "text-orange-500 font-bold" : ""}>
                        {item.label}
                        </span>
                        {item.badge && (
                        <span className="ml-auto bg-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {item.badge}
                        </span>
                        )}
                    </NavLink>
                ))}
            </nav>
            <div className="bg-indigo-100 flex items-center justify-center border border-blue-300 rounded-xl py-2 px-4 flex-col gap-4 mb-4">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                    <FaBolt size={14} color="orange" />
                    <span>Dùng {usageData.used}/{usageData.total} video</span>
                </div>
                <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                    ></div>
                </div>
                <button className="w-full bg-blue-600 text-white rounded-lg py-2 font-bold text-sm hover:bg-blue-700 transition">
                    Nâng cấp Premium
                </button>
            </div>
            <div className="border-t border-gray-200 mt-auto pt-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {userData.avatar}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">{userData.name}</span>
                        <span className="text-xs text-gray-500">{userData.plan}</span>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-xl py-2 text-red-500 text-sm font-bold hover:bg-red-50 transition-colors"
                >
                    <FaSignOutAlt />
                    Đăng xuất
                </button>
                
            </div>

        </aside>
    )
}

export default Sidebar