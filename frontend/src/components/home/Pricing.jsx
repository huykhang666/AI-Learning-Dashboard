import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa";

function Pricing({ onRegister }) {
  const { t } = useTranslation();

  const getArray = (key) => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : [];
  };

  const plans = [
    {
      name: t("pricing.plans.free.label"),
      price: "0đ",
      period: "",
      highlight: false,
      badge: null,
      features: getArray("pricing.plans.free.features"),
      buttonText: t("pricing.plans.free.button"),
      buttonStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    },
    {
      name: t("pricing.plans.premium.label"),
      price: "79.000đ",
      period: "/tháng",
      highlight: true,
      badge: t("pricing.plans.premium.badge"),
      features: t("pricing.plans.premium.features", { returnObjects: true }),
      buttonText: t("pricing.plans.premium.button"),
      buttonStyle:
        "bg-white bg-gradient-to-r from-blue-700 to-cyan-500 shadow-gray-600 font-bold hover:bg-gray-50",
    },
    {
      name: t("pricing.plans.yearly.label"),
      price: "699.000đ",
      period: "/năm",
      highlight: false,
      badge: t("pricing.plans.yearly.badge"),
      features: t("pricing.plans.yearly.features", { returnObjects: true }),
      buttonText: t("pricing.plans.yearly.button"),
      buttonStyle:
        "bg-gradient-to-r from-blue-700 to-cyan-500 shadow-gray-600 text-white hover:from-indigo-600 hover:to-blue-500",
    },
  ];

  return (
    <section id="Pricing" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent font-medium text-2xl mb-4">
            {t("pricing.title")}
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("pricing.heading")}
          </h2>
          <p className="text-gray-500 test-base max-w-xl mx-auto">
            {t("pricing.description")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-blue-600 border text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              <div
                className={`text-sm font-medium ${plan.highlight ? "text-indigo-200" : "text-gray-500"}`}
              >
                {plan.name}
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black">{plan.price}</span>
                <span
                  className={`text-sm mb-1 ${plan.highlight ? "text-indigo-200" : "text-gray-400"}`}
                >
                  {plan.period}
                </span>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <span
                      className={
                        plan.highlight ? "text-indigo-200" : "text-indigo-500"
                      }
                    >
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-full font-bold transition mt-4 ${plan.buttonStyle}`}
                onClick={onRegister}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-400 text-sm mb-4">
            {t("pricing.payment_supported")}
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border border-purple-500 bg-purple-100 hover:-translate-y-2 transition">
              <span>
                <FaHeart color="#a40caf" size={16} />
              </span>
              <span className="text-sm font-medium text-gray-600">
                {t("pricing.payment_methods.momo")}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border border-red-500 bg-red-100 hover:-translate-y-2 transition">
              <span>🔴</span>
              <span className="text-sm font-medium text-gray-600">
                {t("pricing.payment_methods.vnpay")}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border border-blue-500 bg-blue-100 hover:-translate-y-2 transition">
              <span>💳</span>
              <span className="text-sm font-medium text-gray-600">
                {t("pricing.payment_methods.visa")}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border border-green-500 bg-green-100 hover:-translate-y-2 transition">
              <span>🏧</span>
              <span className="text-sm font-medium text-gray-600">
                {t("pricing.payment_methods.atm")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Pricing;
