
import { FaBolt } from "react-icons/fa"
function Navbar() {
  const menuItems = [
    { label: "🏠 Trang chủ", href: "#" },
    { label: "✨ Tính năng", href: "#" },
    { label: "💎 Bảng giá", href: "#" },
    { label: "🤝 Về chúng tôi", href: "#" },
    { label: "❓ FAQ", href: "#" },
  ]

  return (
    <nav className="bg-white shadow-sm">
        <div className="max-w-7x1 mx-auto px-4 py-3 flex item justify-between ">
            <div className="flex items-center gap-2">
                <div className="bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-lg">
                    <FaBolt size={16} color="orange" />
                </div>
                <span className="font-bold text-base">
                    AI-LearningDashBoard
                </span>
            </div>
            <ul className="flex items-center gap-1 ">
               { menuItems.map((item) => (
                   <li key = {item.label}>
                    <a href={item.href} className="bg-white px-6 py-2 rounded-full text-sm text-gary-600 hover:bg-gray-100 font-bold"> {item.label} </a>
                   </li>
                ))}
            </ul>
            <div className="flex items-center gap-1">
                <a href="#" className="font-bold border border-gray-300 px-3 py-1.5 rounded-full hover:text-indigo-600">
                    Đăng nhập
                </a>
                <a href="#" className="flex items-center gap-2 bg-indigo-600 text-Plus Jakarta Sans text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-indigo-700">
                    🚪Sign Up Free
                </a>
            </div>
        </div>

    </nav>
  )
}

export default Navbar