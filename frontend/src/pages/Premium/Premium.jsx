import React from "react";
import { Target, Clock, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import Pricing from "../../components/home/Pricing";

const PremiumPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-50 min-h-screen pt-12 pb-24">
      <div className="flex flex-col items-center text-center mb-4 px-4">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-bold text-sm mb-6 border border-orange-200 shadow-sm">
          <Zap size={16} className="fill-orange-500" />
          {t("premium.banner")}
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 max-w-3xl leading-tight">
          {t("premium.heading_line1")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            {t("premium.heading_line2")}
          </span>
        </h1>

        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm md:text-base font-semibold text-slate-600">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            <Target className="text-blue-500" size={20} />{" "}
            {t("premium.benefit.focus")}
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            <Clock className="text-green-500" size={20} />{" "}
            {t("premium.benefit.save_time")}
          </div>
        </div>

        <button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 text-lg">
          {t("premium.cta")}
        </button>
      </div>

      <div className="-mt-8">
        <Pricing />
      </div>
    </div>
  );
};

export default PremiumPage;
