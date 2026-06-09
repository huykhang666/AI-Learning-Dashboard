import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

const LANGUAGES = [
  { code: "vi", label: "Tiếng Việt", short: "VI", flag: "🇻🇳" },
  { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
  { code: "ja", label: "日本語", short: "JA", flag: "🇯🇵" },
  { code: "ko", label: "한국어", short: "KO", flag: "🇰🇷" },
];

function LanguageSwitcher({ className = "" }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguageCode = i18n.resolvedLanguage?.split("-")[0] || i18n.language?.split("-")[0] || "vi";
  const currentLang = LANGUAGES.find(l => l.code === currentLanguageCode) || LANGUAGES[0];

  const handleChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-white/80 backdrop-blur-md px-3.5 py-2 text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer select-none"
        type="button"
      >
        <span>🌐</span>
        <span className="uppercase">{currentLang.short}</span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute right-0 mt-1.5 w-32 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] z-50 py-1 overflow-hidden origin-top-right"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleChange(lang.code)}
                className={`w-full text-left px-3.5 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between ${
                  currentLanguageCode === lang.code
                    ? "bg-indigo-50/80 text-indigo-650 font-bold"
                    : "text-zinc-700 hover:bg-zinc-50"
                }`}
                type="button"
              >
                <span>{lang.label}</span>
                <span className="text-[10px] text-zinc-400 font-mono">{lang.flag}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSwitcher;
