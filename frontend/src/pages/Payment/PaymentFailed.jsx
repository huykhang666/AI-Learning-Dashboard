import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentFailedPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-4">
      <h1 className="text-2xl font-bold text-red-600">Thanh toán thất bại</h1>
      <button onClick={() => navigate('/app/premium')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl">Thử lại</button>
    </div>
  );
}