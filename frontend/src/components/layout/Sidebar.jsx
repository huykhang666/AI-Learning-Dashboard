import { useState } from "react"
import { FaBolt } from "react-icons/fa"
import Dashboard from "../../pages/dashboard/Dashboard"

function Sidebar({ onLogout }) {
    const [active, setActive] = useState("dashboard")
    const menuItems = [
        { label: "Dashboard", key: "dashboard"},
        { label: "MyCourses", key: "courses"},
        { label: "Lịch sử", key: "History"},
        { label: "Analytics", key: "analytics"},
        { label: "Premium", key: "premium", badge: "FREE"},
        { label: "Settings", key: "settings"},
        { label: "Help Center", key: "help"},
    ]
    return (
        <aside className="w-48 min-h-screen bg-white border-r border-gray-100 flex flex-col px-3 py-4">
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
                    <button
                        key={item.key}
                        onClick={() => setActive(item.key)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition w-full text-left ${ active === item.key ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}                 
                    >
                        <span className={item.key === "premium" ? "text-orange-500 font-bold" : ""}>
                            {item.label}
                        </span>
                        {item.badge && (
                            <span className="ml-auto bg-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </nav>
            <div className="mb-4">
                Usage
            </div>
            <div>
                User
            </div>

        </aside>
    )
}

export default Sidebar