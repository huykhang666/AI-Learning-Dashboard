import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/app/dash");
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
        Thanh toán thành công!
      </h1>
      <button
        onClick={() => navigate("/app/dash")}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl"
      >
        Về Dashboard
      </button>
    </div>
  );
}
