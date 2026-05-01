import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-4">
      <h1 className="text-2xl font-bold text-green-600">Thanh toán thành công!</h1>
      <button onClick={() => navigate('/app/dash')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl">Về Dashboard</button>
    </div>
  );
}