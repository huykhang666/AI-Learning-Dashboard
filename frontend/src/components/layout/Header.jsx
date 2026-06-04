import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { FaUser, FaReceipt, FaSignOutAlt, FaCrown } from "react-icons/fa"; 
import UserProfileModal from "../../pages/Premium/UserProfileModal";
import { motion, AnimatePresence } from "motion/react";

const IconMenu = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round">
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
  
  // REALTIME DROPDOWN:
  const [notifications, setNotifications] = useState([
    { id: 1, message: t("header.notifications.welcome"), createdAt: t("header.time_ago"), isRead: true }
  ]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("profile");
  const userMenuRef = useRef(null);

  const [localUserData, setLocalUserData] = useState({
    fullName: userData?.fullName || t("header.default_user_name"),
    avatar: userData?.avatar || "NK",
    isImage: false,
    isPremium: userData?.isPremium || false 
  });

  useEffect(() => {
    if (userData) {
      setLocalUserData({
        fullName: userData.fullName || t("header.default_user_name"),
        avatar: userData.avatar || "NK",
        isImage: false,
        isPremium: userData.isPremium || false
      });
    }
  }, [userData, t]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleWSNotification = (event) => {
      const newNoti = event.detail; 
      
      const formattedNoti = {
        id: newNoti.id || Date.now(),
        message: newNoti.message || t("header.notifications.system_processed"),
        createdAt: t("header.time_ago"),
        isRead: false
      };

      setNotifications((prev) => [formattedNoti, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    window.addEventListener("ws-notification", handleWSNotification);
    return () => window.removeEventListener("ws-notification", handleWSNotification);
  }, [t]);

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
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200/50 flex items-center justify-between gap-4 px-6 py-3.5 transition-all">
      {/* Left side: Hamburger (Mobile) & Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Hamburger Menu (Mobile) */}
        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuOpen}
            aria-label={t("header.aria.open_menu")}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-indigo-600 hover:bg-indigo-50 border border-zinc-200/80 bg-white shadow-sm transition-colors"
          >
            <IconMenu />
          </motion.button>
        )}

        {/* Search Input */}
        <div className="flex-1 max-w-md min-w-0">
          <div className="flex items-center bg-zinc-50 hover:bg-zinc-100/50 px-3.5 py-2 rounded-xl border border-zinc-200/80 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-200 shadow-sm">
            <span className="text-zinc-400 mr-2.5 shrink-0 transition-colors">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder={t("header.search_placeholder")}
              className="bg-transparent outline-none w-full min-w-0 text-sm text-zinc-800 placeholder-zinc-400 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Right side: Actions (Language, Bell, Avatar) */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hover:scale-105 transition-transform duration-200">
          <LanguageSwitcher />
        </div>
        
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 shrink-0 rounded-xl border transition-all duration-200 shadow-sm relative ${
              showDropdown 
                ? 'text-indigo-600 bg-indigo-50 border-indigo-200' 
                : 'text-zinc-500 bg-white border-zinc-200/80 hover:bg-zinc-50'
            }`}
            onClick={handleBellClick}
          >
            <IconBell />
            
            {/* BADGE SỐ */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </motion.button>

          {/* DROPDOWN MENU THẢ XUỐNG */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute right-0 mt-2.5 w-80 bg-white/95 backdrop-blur-xl border border-zinc-200/80 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] z-50 py-1 overflow-hidden origin-top-right"
              >
                <div className="px-4 py-3 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">{t("header.notifications.title")}</span>
                  <span 
                    className="text-[11px] text-indigo-600 font-semibold cursor-pointer hover:underline" 
                    onClick={() => setNotifications(p => p.map(n => ({ ...n, isRead: true })))}
                  >
                    {t("header.notifications.mark_read")}
                  </span>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto divide-y divide-zinc-100">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-zinc-400 font-medium">
                      {t("header.notifications.empty")}
                    </div>
                  ) : (
                    notifications.map((noti) => (
                      <div 
                        key={noti.id} 
                        className={`px-4 py-3 hover:bg-zinc-50/80 cursor-pointer transition flex gap-3 items-start ${!noti.isRead ? 'bg-indigo-550/5' : ''}`}
                      >
                        <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!noti.isRead ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-transparent'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs text-zinc-700 leading-relaxed break-words ${!noti.isRead ? 'font-semibold text-zinc-900' : ''}`}>
                            {noti.message}
                          </p>
                          <span className="text-[10px] text-zinc-400 mt-1 block font-medium">
                            {noti.createdAt}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar */}
        <div className="relative" ref={userMenuRef}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAvatarClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all relative ${
              localUserData.isPremium 
                ? 'bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300 p-[2px] ring-2 ring-amber-400 ring-offset-1 shadow-md' 
                : 'bg-blue-500 text-white hover:bg-blue-600 border border-zinc-200/50'
            } ${showUserDropdown ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
          >
            {/* Inner Avatar wrapper */}
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-blue-500 text-white font-bold select-none">
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

            {/* CÀI BADGE PREMIUM */}
            {localUserData.isPremium && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full flex items-center justify-center text-[9px] text-white shadow-md border border-white animate-pulse">
                <FaCrown />
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showUserDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute right-0 md:-right-2 mt-2.5 w-64 bg-white/95 backdrop-blur-xl border border-zinc-200/80 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] py-1.5 z-50 overflow-hidden origin-top-right"
              >
                <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wider">{t("header.account_label")}</p>
                    <p className="text-sm font-bold text-zinc-800 truncate mt-0.5">{localUserData.fullName}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 ${
                    localUserData.isPremium 
                      ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-600 border border-amber-200/50 shadow-sm' 
                      : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                  }`}>
                    {localUserData.isPremium ? "PRO" : "FREE"}
                  </span>
                </div>

                <div className="p-1">
                  <button 
                    onClick={() => {
                      setModalTab("profile");
                      setIsModalOpen(true);
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-zinc-650 hover:bg-zinc-50 rounded-xl flex items-center gap-2.5 transition-colors"
                  >
                    <FaUser className="text-zinc-400" size={12} /> {t("header.user_menu.profile")}
                  </button>

                  <button 
                    onClick={() => {
                      setModalTab("billing");
                      setIsModalOpen(true);
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-zinc-650 hover:bg-indigo-50/80 hover:text-indigo-650 rounded-xl flex items-center gap-2.5 transition-colors"
                  >
                    <FaReceipt className="text-indigo-500/80" size={12} /> {t("header.user_menu.billing")}
                  </button>

                  <hr className="my-1 border-zinc-100" />
                  
                  <button 
                    onClick={onLogout} 
                    className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-2.5 transition-colors"
                  >
                    <FaSignOutAlt className="text-red-400" size={12} /> {t("header.user_menu.logout")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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