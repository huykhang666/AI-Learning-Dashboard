"use client";

import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import {
  Mic,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Link,
  FileText,
  Tag,
  Lock,
  Upload,
  Settings,
  GraduationCap,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

function Feature() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const features = [
    {
      icon: Mic,
      title: t("feature.cards.whisper.title"),
      description: t("feature.cards.whisper.description"),
    },
    {
      icon: Sparkles,
      title: t("feature.cards.summary.title"),
      description: t("feature.cards.summary.description"),
    },
    {
      icon: MessageSquare,
      title: t("feature.cards.chat.title"),
      description: t("feature.cards.chat.description"),
    },
    {
      icon: TrendingUp,
      title: t("feature.cards.progress.title"),
      description: t("feature.cards.progress.description"),
    },
    {
      icon: Link,
      title: t("feature.cards.youtube.title"),
      description: t("feature.cards.youtube.description"),
    },
    {
      icon: FileText,
      title: t("feature.cards.export.title"),
      description: t("feature.cards.export.description"),
    },
    {
      icon: Tag,
      title: t("feature.cards.tags.title"),
      description: t("feature.cards.tags.description"),
    },
    {
      icon: Lock,
      title: t("feature.cards.security.title"),
      description: t("feature.cards.security.description"),
    },
  ];

  const action = [
    {
      icon: Upload,
      title: t("feature.steps.upload.title"),
      description: t("feature.steps.upload.description"),
    },
    {
      icon: Settings,
      title: t("feature.steps.process.title"),
      description: t("feature.steps.process.description"),
    },
    {
      icon: GraduationCap,
      title: t("feature.steps.learn.title"),
      description: t("feature.steps.learn.description"),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-50/20 py-20 md:py-28 border-t border-zinc-200/50" id="Feature">
      {/* Lưới tọa độ chấm và ánh sáng mờ đồng bộ với HeroSection */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="hero-dot-grid-light absolute inset-0 opacity-40" />
        <div className="absolute top-[15%] left-[-10%] w-[450px] h-[450px] rounded-full bg-blue-400/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/5 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-[1120px] mx-auto px-6">
        {/* Khối Tiêu đề phần Tính năng chính */}
        <div className="text-center mb-16">
          <div className="mb-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent font-semibold text-lg md:text-xl tracking-wide uppercase">
            {t("feature.title")}
          </div>
          <h2 className="text-zinc-950 text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {t("feature.heading")}
          </h2>
          <p className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            {t("feature.description")}
          </p>
        </div>

        {/* Lưới các thẻ Tính năng chính với hiệu ứng Stagger Scroll Reveal */}
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: false, amount: 0.08 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((item) => (
            <FeatureCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </motion.div>

        {/* Khối Tiêu đề phần Quy trình hoạt động */}
        <div className="text-center mb-16">
          <div className="mb-3 mt-24 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent font-semibold text-lg md:text-xl tracking-wide uppercase">
            {t("feature.process.title")}
          </div>
          <h2 className="text-zinc-950 font-bold text-3xl md:text-4xl tracking-tight mb-4">
            {t("feature.process.heading")}
          </h2>
        </div>

        {/* Lưới các bước hoạt động */}
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: false, amount: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {action.map((item) => (
            <FeatureCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Feature;