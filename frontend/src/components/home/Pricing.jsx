  import React, { useState } from 'react';
  import {
    FaHeart, FaCheck, FaBolt, FaCrown,
    FaStar, FaRocket, FaCreditCard,
    FaUniversity, FaShieldAlt, FaTimes, FaInfoCircle
  } from "react-icons/fa";
  import { paymentApi } from '../../api/paymentApi';
  import momoLogo from '../../img/MoMo.png';
  import vnpayLogo from '../../img/VNpay.png';
  import { jwtDecode } from "jwt-decode";

  const PLANS_CONFIG = [
    {
      id: 'free',
      name: "Free",
      label: "Miễn phí",
      priceStr: "0đ",
      priceValue: 0,
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
      buttonStyle: "border-2 border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50",
    },
    {
      id: 'monthly',
      name: "Premium",
      label: "Premium Tháng",
      priceStr: "79.000đ",
      priceValue: 79000,
      period: "/tháng",
      highlight: true,
      badge: "PHỔ BIẾN NHẤT",
      icon: <FaCrown size={20} className="text-yellow-300" />,
      features: [
        "Không giới hạn video/ngày",
        "Transcript độ chính xác cao",
        "Chat AI không giới hạn",
        "Export PDF & Lưu trữ vô hạn",
        "Ưu tiên xử lý (High Priority)",
        "Hỗ trợ 24/7",
      ],
      buttonText: "Nâng cấp ngay",
      buttonStyle: "bg-white text-blue-700 font-bold hover:bg-blue-50 shadow-lg",
    },
    {
      id: 'yearly',
      name: "Premium Năm",
      label: "Premium Năm",
      priceStr: "699.000đ",
      priceValue: 699000,
      period: "/năm",
      highlight: false,
      badge: "TIẾT KIỆM 26%",
      icon: <FaRocket size={20} className="text-cyan-500" />,
      features: [
        "Tất cả tính năng Premium",
        "Tiết kiệm ~179.000đ/năm",
        "Tính năng Beta sớm nhất",
        "Badge VIP trên profile",
        "Hỗ trợ riêng (VIP Support)",
      ],
      buttonText: "Chọn gói năm",
      buttonStyle: "bg-gradient-to-r from-blue-700 to-cyan-500 text-white font-bold hover:from-blue-800 hover:to-cyan-600 shadow-lg",
    },
  ];

  const SUPPORTED_PAYMENTS = [
    { label: "VNPay", icon: <FaShieldAlt className="text-red-500" /> },
    { label: "Visa/Master", icon: <FaCreditCard className="text-blue-500" /> },
    { label: "ATM", icon: <FaUniversity className="text-green-600" /> },
    { label: "MoMo", icon: <FaHeart className="text-purple-600" /> },
  ];

  const GATEWAY_OPTIONS = [
    {
      id: 'VNPAY',
      name: 'VNPay',
      description: 'Ví VNPay · Thẻ ATM · QR Code',
      note: 'Bảo mật chuẩn quốc tế PCI DSS',
      logo: vnpayLogo,
    },
    {
      id: 'MOMO',
      name: 'MoMo',
      description: 'Ví điện tử MoMo',
      note: 'Thanh toán nhanh qua ứng dụng MoMo',
      logo: momoLogo,
    },
  ];

  const Pricing = ({ onRegister }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedGateway, setSelectedGateway] = useState('VNPAY');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSelectPlan = (plan) => {
      if (plan.id === 'free') return onRegister?.();
      setSelectedGateway('VNPAY');
      setSelectedPlan(plan);
    };

    const handleClose = () => {
      if (isProcessing) return;
      setSelectedPlan(null);
    };


    const handleConfirmPayment = async () => {
      try {
        setIsProcessing(true);
        const token = localStorage.getItem("token");

        const decoded = jwtDecode(token);
        const userId = decoded.userId || decoded.id;

        if (!userId) {
          alert("Không tìm thấy ID người dùng. Hãy thử Đăng xuất và Đăng nhập lại!");
          return;
        }

        const paymentRequest = {
          userId: Number(userId),
          amount: selectedPlan.priceValue,
          planType: selectedPlan.id === "monthly" ? "PREMIUM_MONTHLY" : "PREMIUM_YEARLY",
          gateway: selectedGateway,
        };

        console.log("Đang gửi ID thanh toán:", userId);

        const response = await paymentApi.createPaymentUrl(paymentRequest);
        if (response?.code === "00" && response?.paymentUrl) {
          window.location.href = response.paymentUrl;
        }
      } catch (error) {
        alert("Hệ thống bận!");
      } finally {
        setIsProcessing(false);
      }
    };

    return (
      <section id="Pricing" className="bg-gray-50 py-24 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              <FaStar size={11} /> Bảng Giá Dịch Vụ
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
              Chọn gói <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500">phù hợp</span> với bạn
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">Nâng cấp để trải nghiệm học tập không giới hạn cùng AI.</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PLANS_CONFIG.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl flex flex-col p-8 transition-all duration-300 hover:-translate-y-1 ${plan.highlight
                  ? "bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-2xl scale-105 z-10"
                  : "bg-white text-gray-900 shadow-sm border border-gray-100"
                  }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-black px-4 py-1.5 rounded-full whitespace-nowrap ${plan.highlight ? "bg-yellow-400 text-yellow-900" : "bg-blue-600 text-white"
                    }`}>
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.highlight ? "bg-white/20" : "bg-blue-50"}`}>
                    {plan.icon}
                  </div>
                  <span className={`text-xs font-bold uppercase ${plan.highlight ? "text-blue-100" : "text-gray-400"}`}>
                    {plan.label}
                  </span>
                </div>

                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-black tracking-tight">{plan.priceStr}</span>
                  <span className={`text-sm mb-1.5 font-medium ${plan.highlight ? "text-blue-200" : "text-gray-400"}`}>
                    {plan.period}
                  </span>
                </div>

                <div className={`h-px w-full mb-6 ${plan.highlight ? "bg-white/20" : "bg-gray-100"}`} />

                <ul className="flex flex-col gap-3.5 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-white/20 text-white" : "bg-blue-50 text-blue-500"
                        }`}>
                        <FaCheck size={8} />
                      </div>
                      <span className={plan.highlight ? "text-blue-50" : "text-gray-600"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center mt-16">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Đối tác thanh toán tin cậy</p>
            <div className="flex flex-wrap justify-center gap-4">
              {SUPPORTED_PAYMENTS.map((p) => (
                <div key={p.label} className="flex items-center gap-2 px-5 py-2 rounded-full border bg-white shadow-sm hover:shadow-md transition-all cursor-default">
                  {p.icon}
                  <span className="text-xs font-bold text-gray-600">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CHECKOUT MODAL ── */}
        {selectedPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

              {/* Loading overlay */}
              {isProcessing && (
                <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-5 rounded-3xl">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin" style={{ animationDuration: '0.6s', animationDirection: 'reverse' }} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800">Đang kết nối cổng thanh toán</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {GATEWAY_OPTIONS.find(g => g.id === selectedGateway)?.name}
                      {' '}· Vui lòng không tắt trang...
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Header */}
              <div className="px-7 pt-6 pb-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">Xác nhận đơn hàng</p>
                  <h3 className="text-lg font-black text-slate-900">Gói {selectedPlan.name}</h3>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="text-gray-300 hover:text-gray-500 disabled:opacity-30 transition-colors p-1 rounded-lg"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="px-7 py-6">

                {/* Order Summary */}
                <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Gói đã chọn</p>
                    <p className="text-[15px] font-black text-slate-900">{selectedPlan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-blue-600 leading-none">{selectedPlan.priceStr}</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1 uppercase">
                      {selectedPlan.period?.replace('/', '') || 'Một lần'}
                    </p>
                  </div>
                </div>

                {/* Gateway Selection */}
                <p className="text-sm font-bold text-slate-700 mb-3">Phương thức thanh toán</p>
                <div className="flex flex-col gap-2.5 mb-6">
                  {GATEWAY_OPTIONS.map((gw) => {
                    const active = selectedGateway === gw.id;
                    return (
                      <button
                        key={gw.id}
                        onClick={() => !isProcessing && setSelectedGateway(gw.id)}
                        disabled={isProcessing}
                        className={`flex items-center gap-4 w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all duration-200 disabled:opacity-50 ${active
                          ? 'border-blue-500 bg-blue-50/50'
                          : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <div className="w-[52px] h-9 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 p-1.5">
                          <img src={gw.logo} alt={gw.name} className="w-full h-full object-contain" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 leading-none mb-0.5">{gw.name}</p>
                          <p className="text-[11px] text-slate-500">{gw.description}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{gw.note}</p>
                        </div>

                        <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${active ? 'border-blue-500' : 'border-gray-300'}`}>
                          {active && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Terms Note */}
                <div className="flex gap-2.5 items-start bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6">
                  <FaInfoCircle className="text-amber-400 shrink-0 mt-0.5" size={13} />
                  <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                    Bằng việc nhấn xác nhận, bạn đồng ý với Điều khoản dịch vụ. Bạn sẽ được chuyển hướng an toàn đến cổng{' '}
                    <span className="font-bold">{GATEWAY_OPTIONS.find(g => g.id === selectedGateway)?.name}</span>.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2.5">
                  <button
                    disabled={isProcessing}
                    onClick={handleConfirmPayment}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-[15px] shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <FaShieldAlt size={13} />
                        Tiến hành thanh toán
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleClose}
                    disabled={isProcessing}
                    className="w-full py-3 text-sm text-gray-400 hover:text-gray-600 disabled:opacity-30 font-semibold transition-colors"
                  >
                    Hủy giao dịch
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </section>
    );
  };

  export default Pricing;