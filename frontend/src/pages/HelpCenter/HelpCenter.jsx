import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import {
  Rocket,
  Upload,
  MessageCircle,
  CreditCard,
  Search,
  ChevronDown,
  Headphones,
  Sparkles,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Zap,
} from "lucide-react";

/* ─── topic config ─── */
const topics = [
  {
    icon: Rocket,
    labelKey: "help_center.topics.getting_started",
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-200/40",
    bgTint: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Upload,
    labelKey: "help_center.topics.upload",
    gradient: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-200/40",
    bgTint: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: MessageCircle,
    labelKey: "help_center.topics.chatbot",
    gradient: "from-violet-500 to-purple-500",
    glow: "shadow-violet-200/40",
    bgTint: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: CreditCard,
    labelKey: "help_center.topics.account_billing",
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-200/40",
    bgTint: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

const faqs = [
  { qKey: "help_center.faqs.upload.q", aKey: "help_center.faqs.upload.a" },
  { qKey: "help_center.faqs.premium.q", aKey: "help_center.faqs.premium.a" },
  { qKey: "help_center.faqs.processing.q", aKey: "help_center.faqs.processing.a" },
  { qKey: "help_center.faqs.youtube.q", aKey: "help_center.faqs.youtube.a" },
];

/* ─── shared easing ─── */
const revealEase = [0.16, 1, 0.3, 1];

/* ─── FAQ Accordion Item ─── */
function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: revealEase }}
      className="group"
    >
      <div
        className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
          open
            ? "border-indigo-200 bg-white shadow-lg shadow-indigo-50/50 ring-1 ring-indigo-100/50"
            : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/80"
        }`}
      >
        {/* Question row */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-4 px-5 py-4.5 sm:px-6 sm:py-5 cursor-pointer text-left select-none"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                open
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
              }`}
            >
              <HelpCircle size={15} strokeWidth={2} />
            </div>
            <span
              className={`text-sm sm:text-[15px] font-semibold transition-colors duration-200 ${
                open ? "text-indigo-700" : "text-slate-800"
              }`}
            >
              {q}
            </span>
          </div>

          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200 ${
              open
                ? "bg-indigo-100 text-indigo-600"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            <ChevronDown size={16} strokeWidth={2.5} />
          </motion.div>
        </button>

        {/* Answer panel */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
                <div className="pl-11 border-l-2 border-indigo-100 ml-[3px]">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {a}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function HelpCenter() {
  const { t } = useTranslation();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-3xl mx-auto">

        {/* ── Hero / Title ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: revealEase }}
          className="text-center mb-10 sm:mb-14"
        >
          {/* Decorative icon */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-xl shadow-indigo-200/50 mb-6"
          >
            <BookOpen size={28} className="text-white sm:hidden" />
            <BookOpen size={34} className="text-white hidden sm:block" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            {t("help_center.title")}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
            {t("help_center.contact_description")}
          </p>
        </motion.div>

        {/* ── Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: revealEase }}
          className="mb-10 sm:mb-14"
        >
          <div
            className={`relative flex items-center gap-3 rounded-2xl border px-4 py-3.5 sm:px-5 sm:py-4 transition-all duration-300 bg-white ${
              searchFocused
                ? "border-indigo-300 shadow-lg shadow-indigo-100/60 ring-2 ring-indigo-100/40"
                : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md"
            }`}
          >
            <Search
              size={18}
              className={`shrink-0 transition-colors duration-200 ${
                searchFocused ? "text-indigo-500" : "text-slate-400"
              }`}
            />
            <input
              placeholder={t("help_center.search_placeholder")}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full bg-transparent text-sm sm:text-[15px] text-slate-800 placeholder:text-slate-400 outline-none"
            />

            {/* Keyboard shortcut hint */}
            <div className="hidden sm:flex items-center gap-1 shrink-0">
              <kbd className="px-2 py-1 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded-md border border-slate-200">
                Ctrl
              </kbd>
              <kbd className="px-2 py-1 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded-md border border-slate-200">
                K
              </kbd>
            </div>
          </div>
        </motion.div>

        {/* ── Popular Topics ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-2 mb-5 sm:mb-6">
            <Sparkles size={18} className="text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {t("help_center.popular_topics")}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {topics.map((topic, i) => {
              const Icon = topic.icon;
              return (
                <motion.button
                  key={topic.labelKey}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: revealEase,
                  }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-6 rounded-2xl border border-slate-200/60 bg-white cursor-pointer transition-shadow duration-300 hover:shadow-xl hover:${topic.glow} group overflow-hidden`}
                >
                  {/* Hover gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${topic.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-2xl`}
                  />

                  {/* Icon container */}
                  <div
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${topic.bgTint} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:${topic.glow}`}
                  >
                    <Icon
                      size={22}
                      className={`${topic.iconColor} transition-transform duration-300 group-hover:scale-110`}
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Label */}
                  <span className="relative text-xs sm:text-sm font-semibold text-slate-700 text-center leading-snug group-hover:text-slate-900 transition-colors duration-200">
                    {t(topic.labelKey)}
                  </span>

                  {/* Bottom accent line on hover */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${topic.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full`}
                  />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── FAQs ── */}
        <div className="mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: revealEase }}
            className="flex items-center gap-2 mb-5 sm:mb-6"
          >
            <HelpCircle size={18} className="text-indigo-500" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {t("help_center.popular_faqs")}
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem
                key={faq.qKey}
                q={t(faq.qKey)}
                a={t(faq.aKey)}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* ── Contact Support CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: revealEase }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600" />

          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative px-6 py-10 sm:px-10 sm:py-12 flex flex-col items-center text-center gap-5">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 12,
                delay: 0.2,
              }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg"
            >
              <Headphones
                size={26}
                className="text-white"
                strokeWidth={1.8}
              />
            </motion.div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight">
                {t("help_center.contact_support")}
              </h3>
              <p className="text-sm text-white/70 max-w-sm leading-relaxed">
                {t("help_center.contact_description")}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-black/10 hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
            >
              <Zap size={16} className="text-indigo-500" />
              {t("help_center.start_live_chat")}
              <ArrowRight
                size={14}
                className="text-indigo-400 transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
