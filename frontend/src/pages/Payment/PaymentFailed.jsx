import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PaymentFailedPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-4">
      <h1 className="text-2xl font-bold text-red-600">{t("payment_result.failed.title")}</h1>
      <button onClick={() => navigate('/app/premium')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl">{t("payment_result.failed.button")}</button>
    </div>
  );
}