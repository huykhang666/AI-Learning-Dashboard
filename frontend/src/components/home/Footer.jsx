import { FaHeart } from "react-icons/fa"

function Footer({ onRegister }) {
  return (
    <footer>
      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 py-20 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">
          Sẵn sàng học thông minh hơn?
        </h2>
        <p className="text-blue-100 text-base mb-8">
          Tham gia cùng 2.000+ sinh viên đang dùng AI-Learning DashBoard mỗi ngày.
        </p>
        <div className="flex items-center justify-center gap-4">
            <a href="#" 
                onClick={onRegister}
                className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition">
                Đăng ký miễn phí ngay →
            </a>
            <a href="#Feature" className="border border-white text-white font-bold px-6 py-3 rounded-full hover:bg-white/10 transition">
                Xem tính năng
            </a>
        </div>

      </div>
      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 border-t border-white/20 py-8 text-center">

        <div className="flex items-center justify-center gap-8 mb-4">
            {[
            { label: "Tính năng", href: "#Feature" },
            { label: "Bảng giá", href: "#Pricing" },
            { label: "Về chúng tôi", href: "#About" },
            { label: "FAQ", href: "#FAQ" },
            { label: "Điều khoản", href: "#" },
            { label: "Bảo mật", href: "#" },
            { label: "Liên hệ", href: "#" },
            ].map((item) => (
            <a key={item.label} href={item.href} className="text-blue-100 text-sm hover:text-white transition">
                {item.label}
            </a>
            ))}
        </div>
        <p className="text-blue-200 text-sm">
          © 2024 AI-Learning DashBoard. Made with{" "}
          <FaHeart className="inline text-red-400" size={12} />{" "}
          in Vietnam 🇻🇳
        </p>

      </div>

    </footer>
  )
}

export default Footer