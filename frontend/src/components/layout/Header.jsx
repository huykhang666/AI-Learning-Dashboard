import React, { useState, useEffect } from "react";

const IconMenu = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconBolt = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconBell = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

export default function Header({ userData = { avatar: "NK" }, hasNotification, onClearNotification, onMenuOpen }) {
  const [searchTerm, setSearchTerm] = useState("");
  // Dùng JS thuần để detect mobile — không phụ thuộc Tailwind breakpoint
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-100 flex items-center gap-2 px-3 py-3">

      {/* Hamburger: hiện khi isMobile=true, ẩn khi desktop (sidebar luôn show) */}
      {isMobile && (
        <button
          onClick={onMenuOpen}
          aria-label="Mở menu"
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-indigo-600 hover:bg-indigo-50 border border-gray-200 transition"
        >
          <IconMenu />
        </button>
      )}

      {/* Search */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center bg-slate-100 px-3 py-2 rounded-xl border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all">
          <span className="text-gray-400 mr-2 shrink-0"><IconSearch /></span>
          <input
            type="text"
            placeholder="Search lectures..."
            className="bg-transparent outline-none w-full min-w-0 text-sm text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-full text-xs font-bold transition shadow-sm whitespace-nowrap">
          <span className="text-yellow-200"><IconBolt /></span>
          <span>Nâng cấp</span>
        </button>
        <button className="relative text-orange-400 hover:text-orange-500 p-2 shrink-0" onClick={onClearNotification}>
          <IconBell />
          {hasNotification && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"/>}
        </button>
        <button className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-md hover:opacity-90 shrink-0">
          {userData.avatar}
        </button>
      </div>
    </header>
  );
}