"use client";

import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa";
import { motion, useReducedMotion } from "motion/react";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

function Footer({ onRegister }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

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
      {/* Khối đăng ký kêu gọi hành động */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-cyan-500 py-20 text-center text-white">
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: false, amount: 0.12 }}
          className="relative z-10 max-w-[1120px] mx-auto px-6"
        >
          <motion.h2 variants={itemVariants} className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
            {t("footer.ready_title")}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-blue-100 text-base md:text-lg max-w-md mx-auto mb-8 leading-relaxed">
            {t("footer.description")}
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="#"
              onClick={onRegister}
              className="bg-white text-indigo-600 font-bold px-7 py-3.5 rounded-full hover:bg-gray-50 transition-colors shadow-lg active:scale-95 cursor-pointer"
              whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
            >
              {t("footer.cta_register")}
            </motion.a>
            <motion.a
              href="#Feature"
              className="border border-white/80 text-white font-bold px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors active:scale-95 cursor-pointer"
              whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
            >
              {t("footer.cta_feature")}
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Khối liên kết Footer chân trang */}
      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 border-t border-white/20 py-8 text-center">
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: false, amount: 0.08 }}
          className="relative z-10 max-w-[1120px] mx-auto px-6"
        >
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 md:gap-8 mb-4">
            {links.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-blue-100 text-sm hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </motion.div>
          <motion.p variants={itemVariants} className="text-blue-200 text-sm">
            {t("footer.copyright", { year: 2024 })} {t("footer.made_with")}{" "}
            <FaHeart className="inline text-red-400" size={12} />{" "}
            {t("footer.in_vietnam")}
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;