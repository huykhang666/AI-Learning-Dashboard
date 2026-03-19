import { FaBolt } from "react-icons/fa";

function Navbar({ onLogin, onRegister }) {
  const menuItems = [
    { label: " TRANG CHỦ", href: "#HeroSection"},
    { label: " TÍNH NĂNG", href: "#Feature" },
    { label: " BẢNG GIÁ", href: "#Pricing" },
    { label: " VỀ CHÚNG TÔI", href: "#" },
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

        <ul className="flex items-center gap-1">
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

        <div className="flex items-center gap-1">
          <button
            onClick={onLogin}
            className="font-bold border border-gray-300 px-3 py-1.5 rounded-full hover:text-indigo-600 bg-white"
          >
            Đăng nhập
          </button>
          <button
            onClick={onRegister}
            className="bg-indigo-600 text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-indigo-700"
          >
            Sign Up Free
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
