import React, { useState, useEffect, useRef } from "react";
import { FaDownload, FaReceipt, FaCheckCircle, FaClock, FaTimesCircle, FaTimes, FaUser } from "react-icons/fa";
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

  // Lắp bẫy lắng nghe thay đổi tab để fetch lịch sử giao dịch
  useEffect(() => {
    if (!isOpen || activeTab !== "billing") return;
    const fetchHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const data = await paymentApi.getTransactionHistory();
        setHistory(data || []);
      } catch (error) {
        console.error("Lỗi khi tải lịch sử giao dịch:", error);
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
      // Kiểm tra định dạng tệp nạp vào phải là hình ảnh
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file định dạng ảnh (png, jpg, jpeg...)!");
        return;
      }
      
      // Tạo đường dẫn blob tạm thời để hiển thị xem trước ngay lập tức
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      
      console.log("Đã nạp file ảnh local thành công:", file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSaveChanges = () => {
    let shortName = "NK";
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

    alert("Cập nhật thông tin tài khoản thành công!");
    onClose(); 
  };

  const handleDownloadInvoice = async (paymentId) => {
    try {
      const responseBlob = await paymentApi.downloadInvoice(paymentId);
      const url = window.URL.createObjectURL(new Blob([responseBlob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      const shortId = paymentId.substring(0, 8).toUpperCase();
      link.setAttribute("download", `invoice_${shortId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Hệ thống không thể xuất hóa đơn!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 w-full max-w-4xl relative z-10 max-h-[85vh] overflow-y-auto transform transition-all">
                <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-all active:scale-95"
        >
          <FaTimes size={12} />
        </button>
        <div className="flex gap-2 border-b border-slate-100 pb-4 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "profile"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <FaUser size={12} /> Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "billing"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <FaReceipt size={12} /> Lịch sử thanh toán
          </button>
        </div>

        {/* NỘI DUNG TAB 1: THÔNG TIN CÁ NHÂN */}
        {activeTab === "profile" && (
          <div className="animate-in fade-in duration-200 max-w-xl">
            <div className="mb-5">
              <label className="block text-[#8A9BB1] text-[10px] font-bold mb-2 uppercase tracking-wide">
                {t("settings.form.name")}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Input điền Email */}
            <div className="mb-5">
              <label className="block text-[#8A9BB1] text-[10px] font-bold mb-2 uppercase tracking-wide">
                {t("settings.form.email")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Khu vực xử lý Avatar hình ảnh */}
            <div className="mb-6">
              <label className="block text-[#8A9BB1] text-[10px] font-bold mb-2.5 uppercase tracking-wide">
                {t("settings.form.avatar")}
              </label>
              <div className="flex items-center gap-4">
                
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "NK"
                  )}
                </div>
                
                <button 
                  type="button"
                  onClick={triggerFileInput}
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                  {t("settings.form.change")}
                </button>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleSaveChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              {t("settings.form.save_changes")}
            </button>
          </div>
        )}

        {/* NỘI DUNG TAB 2: LÌCH SỬ THANH TOÁN */}
        {activeTab === "billing" && (
          <div className="animate-in fade-in duration-200">
            {isLoadingHistory ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-7 h-7 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
                <p className="text-gray-400 text-xs font-medium">Đang tải lịch sử đơn hàng...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                <p className="text-xs text-gray-400 font-medium italic">Bạn chưa thực hiện giao dịch thanh toán nào.</p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full rounded-xl border border-slate-100">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                      <th className="py-2.5 px-3">Mã đơn</th>
                      <th className="py-2.5 px-3">Gói dịch vụ</th>
                      <th className="py-2.5 px-3">Số tiền</th>
                      <th className="py-2.5 px-3">Cổng</th>
                      <th className="py-2.5 px-3">Thời gian</th>
                      <th className="py-2.5 px-3">Trạng thái</th>
                      <th className="py-2.5 px-3 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-gray-600 font-medium">
                    {history.map((item) => (
                      <tr key={item.paymentId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-3 font-mono text-gray-400">
                          #{item.paymentId.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="py-3 px-3 text-gray-900 font-bold">
                          {item.planType === "PREMIUM_YEARLY" ? "Premium 1 Năm" : "Premium 1 Tháng"}
                        </td>
                        <td className="py-3 px-3 text-slate-900 font-extrabold">
                          {item.amount.toLocaleString()} {item.currency}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] uppercase ${
                            item.gateway === 'MOMO' ? 'bg-pink-50 text-pink-600 border border-pink-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {item.gateway}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-400 font-normal">
                          {new Date(item.createdAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="py-3 px-3">
                          {item.status === "SUCCESS" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100">
                              Thành công
                            </span>
                          ) : item.status === "PENDING" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100 animate-pulse">
                              Chờ duyệt
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100">
                              Thất bại
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {item.status === "SUCCESS" ? (
                            <button
                              onClick={() => handleDownloadInvoice(item.paymentId)}
                              className="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-100 px-2 py-1 rounded-xl transition-all"
                            >
                              Tải hóa đơn
                            </button>
                          ) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}