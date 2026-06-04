"use client";

import { useTranslation } from "react-i18next";
import { FaUserTie } from "react-icons/fa";
import { motion, useReducedMotion } from "motion/react";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 16,
    },
  },
};

function About() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const members = [
    {
      name: "Nguyễn Huy Khang",
      role: t("about.team.roles.backend"),
      description: t("about.team.description"),
    },
    {
      name: "Nguyễn Trọng Hiểu",
      role: t("about.team.roles.frontend"),
      description: t("about.team.description"),
    },
    {
      name: "Lê Quang Chí",
      role: t("about.team.roles.frontend"),
      description: t("about.team.description"),
    },
    {
      name: "Trần Minh Huấn",
      role: t("about.team.roles.frontend"),
      description: t("about.team.description"),
    },
  ];

  return (
    <section id="About" className="relative overflow-hidden bg-slate-50/40 py-20 md:py-28 border-t border-zinc-200/50">
      {/* Mạng lưới chấm nền và ánh sáng mờ đồng bộ với HeroSection */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="hero-dot-grid-light absolute inset-0 opacity-80" />
        <div className="hero-spotlight absolute inset-0 opacity-90" />
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px] hero-ambient-drift" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/8 blur-[120px] hero-ambient-drift-reverse" />
      </div>

      <div className="relative z-10 max-w-[1120px] mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: false, amount: 0.08 }}
        >
          {/* Tiêu đề phân mục */}
          <motion.div variants={itemVariants} className="text-center mb-14">
            <div className="mb-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent font-semibold text-lg md:text-xl tracking-wide uppercase">
              {t("about.title")}
            </div>
            <h2 className="text-zinc-950 text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t("about.heading")}
            </h2>
          </motion.div>

          {/* Khối giới thiệu 2 cột */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-16 border-b border-zinc-200/60 py-12"
          >
            {/* Cột trái: Mô tả & Chỉ số (Stats) */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-zinc-500 text-base md:text-lg leading-relaxed mb-4">
                  {t("about.description.line1")}
                </p>
                <p className="text-zinc-500 text-base md:text-lg leading-relaxed mb-8">
                  {t("about.description.line2")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-zinc-200/60 bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-zinc-300 hover:bg-white transition-all">
                  <p className="text-2xl font-bold text-indigo-600">2.000+</p>
                  <p className="text-xs font-medium text-zinc-400 mt-1 uppercase tracking-wider">
                    {t("about.stats.students")}
                  </p>
                </div>
                <div className="border border-zinc-200/60 bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-zinc-300 hover:bg-white transition-all">
                  <p className="text-2xl font-bold text-indigo-600">50.000+</p>
                  <p className="text-xs font-medium text-zinc-400 mt-1 uppercase tracking-wider">
                    {t("about.stats.videos")}
                  </p>
                </div>
                <div className="border border-zinc-200/60 bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-zinc-300 hover:bg-white transition-all">
                  <p className="text-2xl font-bold text-indigo-600">95%</p>
                  <p className="text-xs font-medium text-zinc-400 mt-1 uppercase tracking-wider">
                    {t("about.stats.accuracy")}
                  </p>
                </div>
                <div className="border border-zinc-200/60 bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-zinc-300 hover:bg-white transition-all">
                  <p className="text-2xl font-bold text-indigo-600">4.9 ⭐</p>
                  <p className="text-xs font-medium text-zinc-400 mt-1 uppercase tracking-wider">
                    {t("about.stats.rating")}
                  </p>
                </div>
              </div>
            </div>

            {/* Cột phải: Tầm nhìn (Vision Card) */}
            <div className="flex-1 flex">
              <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 text-white shadow-[0_16px_36px_rgba(79,70,229,0.15)] flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/15 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                    {t("about.vision.tag")}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight tracking-tight">
                    {t("about.vision.heading")}
                  </h3>
                  <p className="text-indigo-100 text-sm md:text-base leading-relaxed mb-8">
                    {t("about.vision.description")}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/15 border border-white/5 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    {t("about.badges.edtech")}
                  </span>
                  <span className="bg-white/15 border border-white/5 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    {t("about.badges.vietnam")}
                  </span>
                  <span className="bg-white/15 border border-white/5 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    {t("about.badges.gdpr")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Phần Đội ngũ sáng lập */}
          <div className="mt-16">
            <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-bold text-zinc-950 text-center mb-12 tracking-tight">
              {t("about.team.title")}
            </motion.h2>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {members.map((member) => (
                <motion.div
                  key={member.name}
                  variants={cardVariants}
                  whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="group bg-white/60 border border-zinc-200/60 backdrop-blur-md rounded-2xl p-6 text-center hover:border-zinc-300 hover:bg-white shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.025)] transition-all duration-300"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <FaUserTie size={24} className="text-indigo-500 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                  <h3 className="font-bold text-zinc-950 mb-1 tracking-tight">{member.name}</h3>
                  <p className="text-indigo-600 text-sm font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-zinc-500 text-sm leading-relaxed">{member.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;