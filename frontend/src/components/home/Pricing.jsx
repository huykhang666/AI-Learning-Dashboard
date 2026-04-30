import { FaHeart, FaCheck, FaBolt, FaCrown, FaStar, FaRocket, FaCreditCard, FaMobileAlt, FaUniversity, FaShieldAlt } from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";

function Pricing({ onRegister }) {
  const plans = [
    {
      name: "Free",
      label: "Miễn phí",
      price: "0đ",
      period: "",
      highlight: false,
      badge: null,
      icon: <FaBolt size={20} className="text-blue-500" />,
      features: [
        "4 video/ngày",
        "Transcript cơ bản",
        "Chat AI: 10 tin/ngày",
        "Lưu tối đa 10 bài",
        "Hỗ trợ email",
      ],
      buttonText: "Bắt đầu miễn phí",
      buttonStyle:
        "border-2 border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50",
    },
    {
      name: "Premium",
      label: "Premium",
      price: "79.000đ",
      period: "/tháng",
      highlight: true,
      badge: "PHỔ BIẾN NHẤT",
      icon: <FaCrown size={20} className="text-yellow-300" />,
      features: [
        "Không giới hạn video/ngày",
        "Transcript độ chính xác cao",
        "Chat AI không giới hạn",
        "Lưu không giới hạn",
        "Export PDF",
        "Ưu tiên xử lý hàng đầu",
        "Hỗ trợ 24/7",
      ],
      buttonText: "Dùng thử 7 ngày miễn phí",
      buttonStyle: "bg-white text-blue-700 font-bold hover:bg-blue-50 shadow-lg",
    },
    {
      name: "Premium Năm",
      label: "Premium Năm",
      price: "699.000đ",
      period: "/năm",
      highlight: false,
      badge: "TIẾT KIỆM 26%",
      icon: <FaRocket size={20} className="text-cyan-500" />,
      features: [
        "Tất cả tính năng Premium",
        "Tiết kiệm ~179.000đ/năm",
        "Ưu tiên hàng đầu",
        "Tính năng Beta sớm nhất",
        "Badge VIP trên profile",
        "Hỗ trợ riêng VIP",
      ],
      buttonText: "Chọn gói năm",
      buttonStyle:
        "bg-gradient-to-r from-blue-700 to-cyan-500 text-white font-bold hover:from-blue-800 hover:to-cyan-600 shadow-lg",
    },
  ];

  const payments = [
    {
      icon: <FaHeart size={16} className="text-purple-600" />,
      label: "MoMo",
      border: "border-purple-200",
      bg: "bg-purple-50",
      text: "text-purple-700",
    },
    {
      icon: <FaShieldAlt size={16} className="text-red-500" />,
      label: "VNPay",
      border: "border-red-200",
      bg: "bg-red-50",
      text: "text-red-700",
    },
    {
      icon: <FaCreditCard size={16} className="text-blue-500" />,
      label: "Visa / Mastercard",
      border: "border-blue-200",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      icon: <FaUniversity size={16} className="text-green-600" />,
      label: "ATM nội địa",
      border: "border-green-200",
      bg: "bg-green-50",
      text: "text-green-700",
    },
  ];

  return (
    <section id="Pricing" className="bg-gray-50 py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-40 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            <FaStar size={11} /> Bảng Giá
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
            Chọn gói{" "}
            <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
              phù hợp
            </span>{" "}
            với bạn
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Miễn phí để bắt đầu. Nâng cấp bất kỳ lúc nào khi bạn cần nhiều hơn.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl flex flex-col transition-transform duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? "bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-2xl shadow-blue-200 scale-105"
                  : "bg-white text-gray-900 shadow-sm border border-gray-100 hover:shadow-md"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-extrabold px-4 py-1.5 rounded-full whitespace-nowrap tracking-wide ${
                    plan.highlight
                      ? "bg-yellow-400 text-yellow-900"
                      : "bg-gradient-to-r from-blue-700 to-cyan-500 text-white"
                  }`}
                >
                  {plan.badge} {plan.highlight ? "" : ""}
                </div>
              )}

              <div className="p-8 flex flex-col gap-5 flex-1">
                {/* Icon + Plan Name */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.highlight ? "bg-white/20" : "bg-blue-50"
                    }`}
                  >
                    {plan.icon}
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold uppercase tracking-widest ${
                        plan.highlight ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      {plan.name}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                  <span
                    className={`text-sm mb-1.5 font-medium ${
                      plan.highlight ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>

                {/* Divider */}
                <div className={`h-px w-full ${plan.highlight ? "bg-white/20" : "bg-gray-100"}`} />

                {/* Features */}
                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          plan.highlight
                            ? "bg-white/20 text-white"
                            : "bg-blue-50 text-blue-500"
                        }`}
                      >
                        <FaCheck size={9} />
                      </span>
                      <span className={plan.highlight ? "text-blue-50" : "text-gray-600"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 mt-2 ${plan.buttonStyle}`}
                  onClick={onRegister}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="text-center mt-14">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-5">
            Phương thức thanh toán được hỗ trợ
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {payments.map((p) => (
              <div
                key={p.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${p.border} ${p.bg} hover:-translate-y-1 transition-transform duration-200 cursor-default`}
              >
                {p.icon}
                <span className={`text-sm font-semibold ${p.text}`}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;