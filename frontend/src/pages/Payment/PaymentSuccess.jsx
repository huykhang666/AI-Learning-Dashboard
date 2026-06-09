import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(5);

useEffect(() => {
  const timer = setInterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        
        window.location.href = "/app/dash"; 
        
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer); 
}, [navigate]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-4">
      <h1 className="inline-flex items-center gap-3 text-2xl font-bold text-green-600">
        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-700 shadow-sm">
          <FaCheckCircle size={20} />
        </span>
        {t("payment_result.success.title")}
      </h1>
      <button
        onClick={() => window.location.href = "/app/dash"}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl"
      >
        {t("payment_result.success.button")}
      </button>
      <p className="mt-3 text-sm text-slate-500">{t("payment_result.success.redirect", { count: countdown })}</p>
    </div>
  );
}
