import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { FaUser, FaReceipt, FaSignOutAlt, FaCrown } from "react-icons/fa"; 
import UserProfileModal from "../../pages/Premium/UserProfileModal";

const IconMenu = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconBell = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export default function Header({
  userData = { avatar: "NK" },
  onMenuOpen,
  onLogout,
}) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // CÁC STATE PHỤC VỤ BIẾN CHUÔNG THÀNH REALTIME DROPDOWN:
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Chào mừng bạn quay trở lại với AI-Learning-Dashboard!", createdAt: "Vừa xong", isRead: true }
  ]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("profile");
  const userMenuRef = useRef(null);

  const [localUserData, setLocalUserData] = useState({
    fullName: userData?.fullName || "Nguyễn Huy Khang",
    avatar: userData?.avatar || "NK",
    isImage: false,
    isPremium: userData?.isPremium || false 
  });

  useEffect(() => {
    if (userData) {
      setLocalUserData({
        fullName: userData.fullName || "Nguyễn Huy Khang",
        avatar: userData.avatar || "NK",
        isImage: false,
        isPremium: userData.isPremium || false
      });
    }
  }, [userData]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.innerWidth < 768 && setUnreadCount(prev => prev); 
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleWSNotification = (event) => {
      const newNoti = event.detail; 
      
      const formattedNoti = {
        id: newNoti.id || Date.now(),
        message: newNoti.message || "Hệ thống vừa xử lý xong yêu cầu của bạn.",
        createdAt: "Vừa xong",
        isRead: false
      };

      setNotifications((prev) => [formattedNoti, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    window.addEventListener("ws-notification", handleWSNotification);
    return () => window.removeEventListener("ws-notification", handleWSNotification);
  }, []);

 useEffect(() => {
    const handleProfileUpdate = (event) => {
      const updatedData = event.detail;
      setLocalUserData(prev => ({
        ...prev,
        fullName: updatedData.fullName,
        avatar: updatedData.avatar,
        isImage: updatedData.isImage,
        isPremium: updatedData.isPremium ?? prev.isPremium 
      }));
    };

    window.addEventListener("user-profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("user-profile-updated", handleProfileUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    setShowUserDropdown(false);
    setUnreadCount(0); 
  };

  const handleAvatarClick = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-100 flex items-center gap-2 px-3 py-4 pr-14">
      {/* Hamburger Menu (Mobile) */}
      {isMobile && (
        <button
          onClick={onMenuOpen}
          aria-label="Mở menu"
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-indigo-600 hover:bg-indigo-50 border border-gray-200 transition"
        >
          <IconMenu />
        </button>
      )}

      {/* Search Input */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center bg-slate-100 px-3 py-2 rounded-xl border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all">
          <span className="text-gray-400 mr-2 shrink-0">
            <IconSearch />
          </span>
          <input
            type="text"
            placeholder={t("header.search_placeholder")}
            className="bg-transparent outline-none w-full min-w-0 text-sm text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Actions Khu vực bên phải Header */}
      <div className="flex items-center gap-1.5 shrink-0">
        <LanguageSwitcher />
        
        {/* KHU VỰC CHUÔNG THÔNG BÁO */}
        <div className="relative" ref={dropdownRef}>
          <button
            className={`p-2 shrink-0 rounded-xl transition ${showDropdown ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-100'}`}
            onClick={handleBellClick}
          >
            <IconBell />
            
            {/* BADGE SỐ: Chỉ hiện khi số lượng tin chưa đọc > 0 */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* DROPDOWN MENU THẢ XUỐNG */}
          {/* DROPDOWN MENU THẢ XUỐNG */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-1 overflow-hidden transition-all duration-200">
              <div className="px-4 py-2.5 border-b border-gray-50 flex justify-between items-center bg-slate-50/50">
                <span className="text-sm font-semibold text-gray-800">Thông báo</span>
                <span 
                  className="text-[11px] text-indigo-600 font-medium cursor-pointer hover:underline" 
                  onClick={() => setNotifications(p => p.map(n => ({ ...n, isRead: true })))}
                >
                  Đánh dấu đã đọc
                </span>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-gray-400">
                    Bạn không có thông báo nào
                  </div>
                ) : (
                  notifications.map((noti) => (
                    <div 
                      key={noti.id} 
                      className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition flex gap-2 items-start ${!noti.isRead ? 'bg-indigo-50/20' : ''}`}
                    >
                      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!noti.isRead ? 'bg-indigo-500' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs text-gray-700 leading-normal break-words ${!noti.isRead ? 'font-medium' : ''}`}>
                          {noti.message}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {noti.createdAt}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative" ref={userMenuRef}>
          {/* Phóng to nút bọc ngoài lên w-10 h-10 để nhìn thoáng đãng và có không gian gài Badge VIP */}
          <button 
            onClick={handleAvatarClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-150 relative active:scale-95 ${
              localUserData.isPremium 
                ? 'bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300 p-[2px] ring-2 ring-amber-400 ring-offset-1' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } ${showUserDropdown ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
          >
            {/* Ruột Avatar: Bọc thêm thẻ div tròn nhỏ bên trong để xử lý viền gradient cho tài khoản Premium */}
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-blue-500 text-white">
              {localUserData.isImage ? (
                <img 
                  src={localUserData.avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                localUserData.avatar
              )}
            </div>

            {/* CÀI BADGE PREMIUM: Nếu là tài khoản VIP, búng thêm cái icon vương miện nhỏ xíu lấp lánh góc chân avatar */}
            {localUserData.isPremium && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full flex items-center justify-center text-[8px] text-white shadow-md border border-white">
                <FaCrown />
              </span>
            )}
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 md:-right-4 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-150">
              <div className="px-4 py-2.5 border-b border-gray-50 bg-slate-50/40 flex justify-between items-center">
                <div className="min-w-0 flex-1 pr-2">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Tài khoản</p>
                  <p className="text-sm font-bold text-gray-800 truncate mt-0.5">{localUserData.fullName}</p>
                </div>
                {/* Badge trạng thái hiển thị bằng chữ bên trong khối Popup */}
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase shrink-0 ${
                  localUserData.isPremium 
                    ? 'bg-amber-50 text-amber-600 border border-amber-100 shadow-sm' 
                    : 'bg-slate-100 text-gray-500'
                }`}>
                  {localUserData.isPremium ? "PRO" : "FREE"}
                </span>
              </div>

              <button 
                onClick={() => {
                  setModalTab("profile");
                  setIsModalOpen(true);
                  setShowUserDropdown(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <FaUser className="text-gray-400" size={12} /> Thông tin cá nhân
              </button>

              <button 
                onClick={() => {
                  setModalTab("billing");
                  setIsModalOpen(true);
                  setShowUserDropdown(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
              >
                <FaReceipt className="text-blue-500/80" size={12} /> Lịch sử thanh toán
              </button>

              <hr className="my-1 border-gray-100" />
              
              <button 
                onClick={onLogout} 
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
              >
                <FaSignOutAlt size={12} /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      <UserProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialTab={modalTab}
      />
    </header>
  );
}