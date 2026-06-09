import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import vi from "./locales/vi.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
      ja: { translation: ja },
      ko: { translation: ko },
    },
    lng: localStorage.getItem("language") || "vi",
    fallbackLng: "vi",
    supportedLngs: ["en", "vi", "ja", "ko"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: [
        "querystring",
        "localStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
      caches: ["localStorage"],
      lookupLocalStorage: "language",
    },
  });

export default i18n;
