import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

function LanguageSwitcher({ className = "" }) {
  const { i18n } = useTranslation();
  const currentLanguage =
    i18n.resolvedLanguage?.split("-")[0] || i18n.language?.split("-")[0];

  const handleChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
  };

  return (
    <div
      className={`language-switcher inline-flex items-center gap-1 ${className}`}
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          className={`lang-btn inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs transition ${
            currentLanguage === lang.code
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
          title={lang.label}
          aria-label={`Chuyển sang ${lang.label}`}
          type="button"
        >
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
