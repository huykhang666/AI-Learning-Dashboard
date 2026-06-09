import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaDownload, FaReceipt, FaCheckCircle, FaClock, FaTimesCircle, FaTimes, FaUser, FaCrown, FaCamera } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { paymentApi } from "../../api/PaymentApi";

export default function UserProfileModal({ isOpen, onClose, initialTab = "profile" }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Ref để tóm cổ thẻ input file ngầm
  const fileInputRef = useRef(null);
  
  // State quản lý ảnh preview local (mặc định bằng null để dùng ảnh chữ viết tắt)
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Quản lý dữ liệu form thông tin cá nhân
  const [formData, setFormData] = useState({
    name: "Nguyễn Huy Khang",
    email: "huukhang@email.com",
  });

  useEffect(() => {
    if (!isOpen || activeTab !== "billing") return;
    const fetchHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const res = await paymentApi.getTransactionHistory();
        const historyData = res?.data || res;
        setHistory(Array.isArray(historyData) ? historyData : []);
      } catch (error) {
        console.error(t("user_profile_modal.errors.load_history"), error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [isOpen, activeTab]);

  // Đồng bộ lại tab mặc định mỗi khi mở modal từ các nút bấm khác nhau ở Header
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý sự kiện khi chọn tệp ảnh từ máy tính
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert(t("user_profile_modal.errors.invalid_image"));
        return;
      }
      
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      
      console.log("Đã nạp file ảnh local thành công:", file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSaveChanges = () => {
    let shortName = t("user_profile_modal.defaults.avatar");
    if (formData.name) {
      const words = formData.name.trim().split(" ");
      if (words.length > 0) {
        shortName = words[words.length - 1].charAt(0).toUpperCase();
      }
    }

    const currentIsPremium = history.some(item => item.status === "SUCCESS");

    const updateEvent = new CustomEvent("user-profile-updated", {
      detail: {
        fullName: formData.name,
        email: formData.email,
        avatar: avatarPreview || shortName,
        isImage: !!avatarPreview,
        isPremium: currentIsPremium 
      }
    });
    window.dispatchEvent(updateEvent);

    alert(t("user_profile_modal.success.update_account"));
    onClose(); 
  };

  const handleDownloadInvoice = async (paymentId) => {
    try {
      const response = await paymentApi.downloadInvoice(paymentId);
      
      // Lấy trực tiếp cục blob data từ response trả về của Axios
      const pdfBlob = response?.data || response;
      const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
      
      const link = document.createElement("a");
      link.href = url;
      const shortId = paymentId.substring(0, 8).toUpperCase();
      link.setAttribute("download", `invoice_${shortId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(t("user_profile_modal.errors.download_invoice"));
    }
  };

  const shortName = formData.name ? formData.name.trim().split(" ").pop().charAt(0).toUpperCase() : "NK";
  const isPremium = history.some(item => item.status === "SUCCESS");

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="bg-white/98 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] w-full max-w-7xl relative z-10 h-[640px] max-h-[90vh] overflow-hidden flex flex-col md:flex-row transform transition-all duration-300 animate-in fade-in zoom-in-95">
        
        {/* Close Button (Mobile Only: floating on top-right, Desktop: in Content) */}
        <button 
          onClick={onClose}
          className="absolute md:hidden top-4 right-4 w-8 h-8 rounded-full bg-zinc-100/80 hover:bg-zinc-200/80 text-zinc-500 flex items-center justify-center transition-all z-20 active:scale-95"
        >
          <FaTimes size={12} />
        </button>

        {/* SIDEBAR NAVIGATION */}
        <div className="w-full md:w-[260px] shrink-0 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50 p-5 md:p-6 flex flex-col justify-between">
          <div>
            {/* User identity card */}
            <div className="flex items-center gap-3.5 pb-5 mb-5 border-b border-slate-150/80">
              <div className="relative group cursor-pointer shrink-0" onClick={triggerFileInput}>
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-lg shadow-inner border border-slate-200 select-none">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    shortName
                  )}
                </div>
                {/* Camera hover trigger */}
                <div className="absolute inset-0 bg-blue-900/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <FaCamera size={12} />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-black text-slate-800 truncate leading-snug">{formData.name}</h4>
                <p className="text-xs text-slate-450 font-medium truncate mt-0.5 leading-none">{formData.email}</p>
                <div className="mt-2 flex">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm border select-none ${
                    isPremium 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white border-amber-400/25' 
                      : 'bg-slate-100 text-slate-400 border-slate-200/60'
                  }`}>
                    {isPremium && <FaCrown size={8} className="shrink-0 text-white" />}
                    {isPremium ? "PRO MEMBER" : "FREE USER"}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu options */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full px-3.5 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all duration-200 active:scale-[0.98] ${
                  activeTab === "profile"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-650 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <FaUser size={13} className={activeTab === "profile" ? "text-white" : "text-slate-400"} />
                {t("user_profile_modal.tabs.profile")}
              </button>
              <button
                onClick={() => setActiveTab("billing")}
                className={`w-full px-3.5 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all duration-200 active:scale-[0.98] ${
                  activeTab === "billing"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-650 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <FaReceipt size={13} className={activeTab === "billing" ? "text-white" : "text-slate-400"} />
                {t("user_profile_modal.tabs.billing")}
              </button>
            </div>
          </div>

          {/* Footer inside sidebar */}
          <div className="hidden md:block pt-4 border-t border-slate-150/80 text-[10px] text-slate-400 font-medium">
            AI-Learning Dashboard v1.2.0
          </div>
        </div>

        {/* MAIN WORKSPACE CONTENT */}
        <div className="flex-1 min-w-0 bg-white p-6 md:p-8 flex flex-col justify-between overflow-y-auto relative">
          
          {/* Close button (Desktop) */}
          <button 
            onClick={onClose}
            className="hidden md:flex absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-150 text-zinc-400 hover:text-zinc-600 items-center justify-center transition-all duration-200 active:scale-95 z-20"
          >
            <FaTimes size={12} />
          </button>

          <div className="flex-1">
            {/* Header info of active tab */}
            <div className="mb-6">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                {activeTab === "profile" ? t("user_profile_modal.tabs.profile") : t("user_profile_modal.tabs.billing")}
              </h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                {activeTab === "profile" 
                  ? "Quản lý thông tin cá nhân, cập nhật tên, địa chỉ email và ảnh đại diện hiển thị của bạn."
                  : "Xem lịch sử giao dịch thanh toán, quản lý gói dịch vụ và tải hóa đơn VAT trực tuyến."}
              </p>
            </div>

            {/* TAB CONTENT: PROFILE */}
            {activeTab === "profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-slate-400 text-[10px] font-extrabold mb-2 uppercase tracking-widest">
                      {t("settings.form.name")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-850 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50/30 hover:bg-slate-50/60 transition-all duration-200 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[10px] font-extrabold mb-2 uppercase tracking-widest">
                      {t("settings.form.email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-855 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50/30 hover:bg-slate-50/60 transition-all duration-200 font-semibold"
                    />
                  </div>
                </div>

                {/* Avatar change block */}
                <div className="mb-6 p-5 bg-slate-50/30 border border-slate-200/60 rounded-2xl flex items-center gap-5">
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xl shrink-0 border border-slate-200 shadow-inner select-none animate-fade-in">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      shortName
                    )}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800 mb-1">Cập nhật ảnh đại diện</h5>
                    <p className="text-[11px] text-slate-450 font-medium mb-3">Tải lên hình ảnh tùy chỉnh của bạn (JPG, PNG, tối đa 5MB).</p>
                    <button 
                      type="button"
                      onClick={triggerFileInput}
                      className="border border-slate-250 hover:border-slate-400 hover:bg-slate-50 text-slate-700 bg-white px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm"
                    >
                      {t("settings.form.change")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: BILLING */}
            {activeTab === "billing" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-5">
                
                {/* Subscription Info Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-lg border border-blue-900/45">
                  {/* Glowing background elements */}
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-blue-400/20 blur-[50px]" />
                  <div className="absolute bottom-0 left-12 w-48 h-48 rounded-full bg-amber-400/15 blur-[50px]" />
                  
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-blue-200 select-none">Gói hiện tại</span>
                      <h3 className="text-lg font-black mt-1 flex items-center gap-2">
                        {isPremium ? "Premium Membership" : "Free Plan Account"}
                        {isPremium && <FaCrown className="text-amber-400" size={12} />}
                      </h3>
                      <p className="text-xs text-blue-100/90 mt-1.5 font-semibold leading-relaxed max-w-[500px]">
                        {isPremium ? "Cảm ơn bạn đã đồng hành! Gói dịch vụ cao cấp của bạn đang hoạt động và có đầy đủ quyền lợi." : "Trải nghiệm các tính năng giới hạn. Nâng cấp ngay để mở khóa toàn bộ sức mạnh AI."}
                      </p>
                    </div>
                    {!isPremium && (
                      <button 
                        onClick={() => {
                          onClose();
                          window.location.hash = "#premium";
                        }}
                        className="bg-white hover:bg-slate-50 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-[0.97] self-start sm:self-center shadow-md select-none"
                      >
                        Nâng cấp PRO
                      </button>
                    )}
                  </div>
                </div>

                {/* Billing History Section */}
                <div className="flex flex-col flex-1 min-h-0">
                  <h4 className="text-xs font-black text-slate-400 mb-3 uppercase tracking-widest select-none">Lịch sử thanh toán</h4>
                  
                  {isLoadingHistory ? (
                    <div className="flex flex-col items-center justify-center py-12 border border-slate-100 rounded-2xl bg-slate-50/20">
                      <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                      <p className="text-slate-400 text-xs font-medium">{t("user_profile_modal.billing.loading")}</p>
                    </div>
                  ) : history.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-slate-250 rounded-2xl bg-slate-50/20">
                      <p className="text-xs text-slate-400 font-medium italic">{t("user_profile_modal.billing.empty")}</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <div className="overflow-x-auto font-sans">
                        <table className="w-full text-left border-collapse min-w-[650px]">
                          <thead>
                            <tr className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/80 border-b border-slate-200/50 select-none">
                              <th className="py-3.5 px-4">{t("user_profile_modal.billing.table.order_id")}</th>
                              <th className="py-3.5 px-4">{t("user_profile_modal.billing.table.plan")}</th>
                              <th className="py-3.5 px-4">{t("user_profile_modal.billing.table.amount")}</th>
                              <th className="py-3.5 px-4">{t("user_profile_modal.billing.table.gateway")}</th>
                              <th className="py-3.5 px-4">{t("user_profile_modal.billing.table.time")}</th>
                              <th className="py-3.5 px-4">{t("user_profile_modal.billing.table.status")}</th>
                              <th className="py-3.5 px-4 text-right">{t("user_profile_modal.billing.table.action")}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[15px] text-slate-600 font-semibold bg-white">
                            {history.map((item) => (
                              <tr key={item.paymentId} className="hover:bg-slate-50/30 transition-colors">
                                <td className="py-4 px-4 font-mono text-slate-400 text-[13px] font-medium">
                                  #{item.paymentId.substring(0, 8).toUpperCase()}
                                </td>
                                <td className="py-4 px-4 text-slate-800 font-bold text-[15.5px]">
                                  {item.planType === "COURSE" 
                                    ? (item.orderInfo || "Mua khóa học")
                                    : (item.planType === "PREMIUM_YEARLY" 
                                      ? t("user_profile_modal.billing.plan_yearly") 
                                      : t("user_profile_modal.billing.plan_monthly"))}
                                </td>
                                <td className="py-4 px-4 text-blue-600 font-extrabold text-[16px]">
                                  {item.amount.toLocaleString()} {item.currency}
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] uppercase tracking-wide select-none ${
                                    item.gateway === 'MOMO' ? 'bg-pink-50 text-pink-600 border border-pink-100/40' : 'bg-blue-50 text-blue-600 border border-blue-100/40'
                                  }`}>
                                    {item.gateway}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-slate-500 font-medium">
                                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                                </td>
                                <td className="py-4 px-4">
                                  {item.status === "SUCCESS" ? (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold bg-green-500/10 text-green-500 px-2.5 py-0.5 rounded-full border border-green-500/30 uppercase tracking-wide select-none">
                                      <FaCheckCircle size={9} className="text-green-500" /> {t("user_profile_modal.billing.status.success")}
                                    </span>
                                  ) : item.status === "PENDING" ? (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-amber-50/80 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-100/30 animate-pulse uppercase tracking-wide select-none">
                                      <FaClock size={8} /> {t("user_profile_modal.billing.status.pending")}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-red-50/80 text-red-700 px-2.5 py-0.5 rounded-full border border-red-100/30 uppercase tracking-wide select-none">
                                      <FaTimesCircle size={8} /> {t("user_profile_modal.billing.status.failed")}
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 px-4 text-right">
                                  {item.status === "SUCCESS" ? (
                                    <button
                                      onClick={() => handleDownloadInvoice(item.paymentId)}
                                      className="inline-flex items-center justify-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-blue-600 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-full px-3 py-1 transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-sm select-none cursor-pointer"
                                    >
                                      <FaDownload size={9} /> {t("user_profile_modal.billing.download_invoice")}
                                    </button>
                                  ) : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action section at bottom (Only for Profile tab to show Save changes, since Billing has no edit actions) */}
          {activeTab === "profile" && (
            <div className="border-t border-zinc-100 pt-5 mt-5 flex justify-end">
              <button 
                type="button"
                onClick={handleSaveChanges}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-2.5 rounded-xl text-xs shadow-sm hover:shadow shadow-blue-500/20 transition-all duration-200 active:scale-[0.97]"
              >
                {t("settings.form.save_changes")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}