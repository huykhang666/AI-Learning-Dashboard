import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa";

function Footer({ onRegister }) {
  const { t } = useTranslation();

  const links = [
    { label: t("nav.features"), href: "#Feature" },
    { label: t("nav.pricing"), href: "#Pricing" },
    { label: t("nav.about"), href: "#About" },
    { label: t("nav.faq"), href: "#FAQ" },
    { label: t("footer.terms"), href: "#" },
    { label: t("footer.privacy"), href: "#" },
    { label: t("nav.contact"), href: "#" },
  ];

  return (
    <footer>
      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 py-20 text-center text-white">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          {t("footer.ready_title")}
        </h2>
        <p className="text-blue-100 text-base mb-8">
          {t("footer.description")}
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <a
            href="#"
            onClick={onRegister}
            className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition"
          >
            {t("footer.cta_register")}
          </a>
          <a
            href="#Feature"
            className="border border-white text-white font-bold px-6 py-3 rounded-full hover:bg-white/10 transition"
          >
            {t("footer.cta_feature")}
          </a>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 border-t border-white/20 py-8 text-center">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-4">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-blue-100 text-sm hover:text-white transition"
            >
              {item.label}
            </a>
          ))}
        </div>
        <p className="text-blue-200 text-sm">
          {t("footer.copyright", { year: 2024 })} {t("footer.made_with")}{" "}
          <FaHeart className="inline text-red-400" size={12} />{" "}
          {t("footer.in_vietnam")}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
