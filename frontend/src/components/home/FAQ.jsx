"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const reduceMotion = useReducedMotion();
  const faqData = t("faq.items", { returnObjects: true });
  const faqs = Array.isArray(faqData) ? faqData : [];

  return (
    <section id="FAQ" className="relative overflow-hidden bg-white py-20 md:py-28 border-t border-zinc-200/50">
      {/* Mạng lưới chấm nền */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="hero-dot-grid-light absolute inset-0 opacity-40" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: false, amount: 0.08 }}
        >
          {/* Tiêu đề phân mục */}
          <motion.div variants={itemVariants} className="text-center mb-14">
            <div className="mb-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent font-semibold text-lg md:text-xl tracking-wide uppercase">
              {t("faq.title")}
            </div>
            <h2 className="text-zinc-950 text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t("faq.section_title")}
            </h2>
          </motion.div>

          {/* Danh sách câu hỏi */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className={`border rounded-2xl px-6 py-4 cursor-pointer transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.005)] ${
                    isOpen
                      ? "border-indigo-200 bg-indigo-50/50 shadow-[0_4px_16px_rgba(79,70,229,0.02)]"
                      : "border-zinc-200/60 bg-white/70 backdrop-blur-sm hover:border-zinc-300 hover:bg-white"
                  }`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-semibold text-base transition-colors duration-300 ${
                        isOpen ? "text-indigo-600" : "text-zinc-800"
                      }`}
                    >
                      {faq.question}
                    </h3>
                    <span className="text-zinc-400 ml-4 flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp size={18} className="text-indigo-500 transition-colors" />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </span>
                  </div>

                  {/* Chuyển động đóng/mở mượt mà */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default FAQ;