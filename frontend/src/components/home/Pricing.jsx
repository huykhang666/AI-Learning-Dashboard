import { FaHeart } from "react-icons/fa"
function Pricing() {
    const plans = [
    {
        name: "Free",
        label: "Miễn phí",
        price: "0đ",
        period: "",
        highlight: false,
        badge: null,
        features: [
        "4 video/ngày",
        "Transcript cơ bản",
        "Chat AI: 10 tin/ngày",
        "Lưu tối đa 10 bài",
        "Hỗ trợ email",
        ],
        buttonText: "Bắt đầu miễn phí",
        buttonStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50"
    },
    {
        name: "Premium",
        label: "Premium",
        price: "79.000đ",
        period: "/tháng",
        highlight: true,
        badge: "PHỔ BIẾN NHẤT 🔥",
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
        buttonStyle: "bg-white bg-gradient-to-r from-blue-700 to-cyan-500 shadow-gray-600 font-bold hover:bg-gray-50"
    },
    {
        name: "Premium Năm",
        label: "Premium Năm",
        price: "699.000đ",
        period: "/năm",
        highlight: false,
        badge: "TIẾT KIỆM 26% 🎉",
        features: [
        "Tất cả tính năng Premium",
        "Tiết kiệm ~179.000đ/năm",
        "Ưu tiên hàng đầu",
        "Tính năng Beta sớm nhất",
        "Badge VIP trên profile",
        "Hỗ trợ riêng VIP",
        ],
        buttonText: "Chọn gói năm",
        buttonStyle: "bg-gradient-to-r from-blue-700 to-cyan-500 shadow-gray-600 text-white hover:from-indigo-600 hover:to-blue-500"
    }
    ]
    return(
         <section id="Pricing" className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent font-medium text-2xl mb-4">BẢNG GIÁ </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Chọn gói phù hợp với bạn </h2>
                    <p className="text-gray-500 test-base max-w-xl mx-auto"> Miễn phí để bắt đầu. Nâng cấp bất kỳ lúc nào khi bạn cần nhiều hơn.</p>
                </div>
                <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <div
                        key={plan.name}
                        className={`relative rounded-2xl p-8 flex flex-col gap-4 ${
                            plan.highlight
                            ? "bg-gradient-to-r from-blue-700 to-cyan-500 shadow-gray-600 text-white shadow-xl"
                            : "bg-white text-gray-900 shadow-sm"
                        }`}
                        >
                        {plan.badge && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                            {plan.badge}
                            </div>
                        )}
                        <div className={`text-sm font-medium ${plan.highlight ? "text-indigo-200" : "text-gray-500"}`}>
                            {plan.name}
                        </div>
                        <div className="flex items-end gap-1">
                            <span className="text-4xl font-black">{plan.price}</span>
                            <span className={`text-sm mb-1 ${plan.highlight ? "text-indigo-200" : "text-gray-400"}`}>
                            {plan.period}
                            </span>
                        </div>
                        <ul className="flex flex-col gap-2 flex-1">
                            {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm">
                                <span className={plan.highlight ? "text-indigo-200" : "text-indigo-500"}>✓</span>
                                {feature}
                            </li>
                            ))}
                        </ul>
                        <button className={`w-full py-3 rounded-full font-bold transition mt-4 ${plan.buttonStyle}`}>
                            {plan.buttonText}
                        </button>
                        </div>
                    ))}
                </div>

                {/* PAYMENT */}
                <div className="text-center mt-10">
                    <p className="text-gray-400 text-sm mb-4">Phương thức thanh toán được hỗ trợ</p>
                    <div className="flex items-center justify-center gap-4">

                        <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border border-purple-500 bg-purple-100 hover:-translate-y-2 transition">
                        <span><FaHeart color="#a40caf" size={16} /></span>
                        <span className="text-sm font-medium text-gray-600">MoMo</span>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border border-red-500 bg-red-100 hover:-translate-y-2 transition">
                        <span>🔴</span>
                        <span className="text-sm font-medium text-gray-600">VNPay</span>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border border-blue-500 bg-blue-100 hover:-translate-y-2 transition">
                        <span>💳</span>
                        <span className="text-sm font-medium text-gray-600">Visa / MasterCard</span>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border border-green-500 bg-green-100 hover:-translate-y-2 transition">
                        <span>🏧</span>
                        <span className="text-sm font-medium text-gray-600">ATM nội địa</span>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
export default Pricing