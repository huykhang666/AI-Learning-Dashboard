import { useState } from "react"
import { FaBolt } from "react-icons/fa";

function Navbar({ onLogin, onRegister }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuItems = [
    { label: " TRANG CHỦ", href: "#HeroSection"},
    { label: " TÍNH NĂNG", href: "#Feature" },
    { label: " BẢNG GIÁ", href: "#Pricing" },
    { label: " VỀ CHÚNG TÔI", href: "#About" },
    { label: " FAQ", href: "#" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-lg">
            <FaBolt size={16} color="orange" />
          </div>
          <span className="font-bold text-base">AI-LearningDashBoard</span>
        </div>

        <ul className=" hidden md:flex flex items-center gap-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="bg-white px-6 py-2 rounded-full text-sm text-gray-1000 hover:bg-gray-100 font-bold hover:text-blue-300"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className=" hidden md:flex flex items-center gap-1">
          <button
            onClick={onLogin}
            className="font-bold border border-gray-300 px-3 py-1.5 rounded-full hover:text-indigo-600 bg-white"
          >
            Đăng nhập
          </button>
          <button
            onClick={onRegister}
            className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white text-sm font-medium px-3 py-1.5 rounded-full hover:from-indigo-600 hover:to-blue-500"
          >
            Sign Up Free
          </button>
        </div>
         {/* HAMBURGER - chỉ hiện mobile */}
        <button className="md:hidden text-gray-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>
        </div>
        {/* MENU MOBILE */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-2">
            {menuItems.map((item) => (
              <a

                key={item.label}
                href={item.href}
                className="text-sm text-gray-600 py-2 active:text-indigo-600 active:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <hr />
            <button onClick={onLogin} className="text-sm font-bold text-gray-700 py-2 text-left">
              Đăng nhập
            </button>
            <button onClick={onRegister} className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white text-sm text-center font-bold px-4 py-2 rounded-full">
              Sign Up Free
            </button>
          </div>
        )}
    </nav>
  );
}

export default Navbar;
