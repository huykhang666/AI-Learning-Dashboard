import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaBolt } from "react-icons/fa";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { motion, AnimatePresence } from "motion/react";

function Navbar({ onLogin, onRegister }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [activeSection, setActiveSection] = useState("");

  const menuItems = [
    { label: t("nav.features"), href: "#Feature" },
    { label: t("nav.pricing"), href: "#Pricing" },
    { label: t("nav.faq"), href: "#FAQ" },
    { label: t("nav.about"), href: "#About" },
  ];

  // Scroll Spy: Tự động highlight menu tương ứng với phần giao diện đang hiển thị
  useEffect(() => {
    const sectionIds = ["Feature", "Pricing", "FAQ", "About"];
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -60% 0px", // Kích hoạt khi phần giao diện nằm ở khoảng giữa màn hình
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    }, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Reset active state khi cuộn lên đầu trang (Hero Section)
    const handleScroll = () => {
      if (window.scrollY < 200) {
        setActiveSection("");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-zinc-200/50 sticky top-0 z-50 h-[76px] w-full flex items-center shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
        
        {/* Logo Area */}
        <a 
          href="#HeroSection" 
          onClick={() => setActiveSection("")}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 rounded-xl p-2 flex items-center justify-center text-white shadow-[0_2px_8px_rgba(79,70,229,0.25)] group-hover:scale-105 transition-all duration-200">
            <FaBolt size={15} className="text-amber-400 group-hover:rotate-6 transition-transform" />
          </div>
          <span className="font-bold tracking-tight text-zinc-950 text-[17px] md:text-[19px] group-hover:text-zinc-800 transition-colors">
            AI Learning Dashboard
          </span>
        </a>

        {/* Navigation Items (Desktop) */}
        <ul 
          className="hidden md:flex items-center gap-2"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {menuItems.map((item, index) => (
            <li 
              key={item.label} 
              className="relative py-1.5"
              onMouseEnter={() => setHoveredIdx(index)}
            >
              <AnimatePresence>
                {hoveredIdx === index && (
                  <motion.span
                    layoutId="navHover"
                    className="absolute inset-0 bg-zinc-100 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              <a
                href={item.href}
                className={`px-4 py-2 text-sm font-bold tracking-wide rounded-xl transition-all duration-200 relative block select-none ${
                  activeSection === item.href 
                    ? "text-indigo-650" 
                    : "text-zinc-650 hover:text-zinc-950"
                }`}
              >
                {item.label}
                
                {/* Active Indicator bar */}
                {activeSection === item.href && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute bottom-[-24px] left-4 right-4 h-[2.5px] bg-indigo-655 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Authentication Section (Desktop) */}
        <div className="hidden md:flex items-center gap-4.5">
          <LanguageSwitcher />
          
          <button
            onClick={onLogin}
            className="text-sm font-bold text-zinc-650 hover:text-indigo-655 transition-colors py-2 cursor-pointer"
          >
            {t("nav.login")}
          </button>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -0.5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRegister}
            className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_18px_rgba(79,70,229,0.4)] transition-all cursor-pointer"
          >
            {t("nav.sign_up")}
          </motion.button>
        </div>

        {/* HAMBURGER - Mobile and tablet trigger */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-50 border border-zinc-200/80 bg-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-[76px] left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-zinc-200/50 shadow-lg px-6 py-4 flex flex-col gap-3.5 z-40 overflow-hidden"
          >
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-[15px] font-bold py-1.5 transition-colors ${
                  activeSection === item.href ? "text-indigo-650" : "text-zinc-650 hover:text-zinc-950"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            
            <hr className="border-zinc-100" />
            
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-bold text-zinc-500">{t("nav.language")}</span>
              <LanguageSwitcher />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogin();
                }}
                className="text-sm font-bold text-zinc-700 bg-zinc-50 hover:bg-zinc-100 py-2.5 rounded-xl border border-zinc-200/60 transition-colors cursor-pointer"
              >
                {t("nav.login")}
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  onRegister();
                }}
                className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white text-sm font-bold text-center py-2.5 rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.25)] transition-all cursor-pointer"
              >
                {t("nav.sign_up")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
