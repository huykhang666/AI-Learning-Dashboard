"use client";

import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import UploadWidget from "../common/UpLoadWidget";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const widgetVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 18,
      mass: 0.85,
      delay: 0.22,
    },
  },
};

const widgetVariantsReduced = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  show: { opacity: 1, y: 0, scale: 1 },
};

/** 7 sắc cầu vồng — tone 0..6 */
const BUBBLE_RISE = [
  { left: "4%", size: 26, tone: 0, delay: 0, duration: 16, drift: "14px", peak: 0.52 },
  { left: "18%", size: 14, tone: 1, delay: 2.5, duration: 13, drift: "-10px", peak: 0.45 },
  { left: "30%", size: 34, tone: 2, delay: 1, duration: 19, drift: "18px", peak: 0.55 },
  { left: "44%", size: 18, tone: 3, delay: 5, duration: 15, drift: "-12px", peak: 0.48 },
  { left: "56%", size: 28, tone: 4, delay: 3, duration: 17, drift: "8px", peak: 0.5 },
  { left: "70%", size: 12, tone: 5, delay: 7, duration: 12, drift: "16px", peak: 0.42 },
  { left: "82%", size: 38, tone: 6, delay: 0.6, duration: 20, drift: "-14px", peak: 0.58 },
  { left: "92%", size: 16, tone: 0, delay: 4, duration: 14, drift: "6px", peak: 0.44 },
];

/** Phải → trái */
const BUBBLE_SWEEP_RTL = [
  { top: "12%", size: 22, tone: 4, delay: 0, duration: 21, yShift: "0px", peak: 0.5 },
  { top: "28%", size: 32, tone: 5, delay: 3, duration: 18, yShift: "24px", peak: 0.55 },
  { top: "42%", size: 14, tone: 6, delay: 6, duration: 15, yShift: "-12px", peak: 0.46 },
  { top: "55%", size: 26, tone: 0, delay: 1.5, duration: 20, yShift: "18px", peak: 0.52 },
  { top: "68%", size: 36, tone: 1, delay: 8, duration: 22, yShift: "0px", peak: 0.58 },
  { top: "78%", size: 18, tone: 2, delay: 4, duration: 16, yShift: "-20px", peak: 0.48 },
  { top: "22%", size: 20, tone: 3, delay: 9, duration: 17, yShift: "32px", peak: 0.5 },
  { top: "62%", size: 12, tone: 4, delay: 11, duration: 14, yShift: "8px", peak: 0.42 },
];

/** Trái → phải */
const BUBBLE_SWEEP_LTR = [
  { top: "18%", size: 24, tone: 6, delay: 0.5, duration: 19, yShift: "0px", peak: 0.52 },
  { top: "35%", size: 16, tone: 0, delay: 4, duration: 16, yShift: "-16px", peak: 0.48 },
  { top: "48%", size: 30, tone: 1, delay: 2, duration: 21, yShift: "20px", peak: 0.56 },
  { top: "58%", size: 12, tone: 2, delay: 7, duration: 14, yShift: "8px", peak: 0.44 },
  { top: "72%", size: 28, tone: 3, delay: 5, duration: 20, yShift: "-24px", peak: 0.54 },
  { top: "85%", size: 20, tone: 4, delay: 9, duration: 17, yShift: "12px", peak: 0.5 },
  { top: "8%", size: 14, tone: 5, delay: 11, duration: 15, yShift: "28px", peak: 0.46 },
  { top: "42%", size: 34, tone: 6, delay: 6.5, duration: 23, yShift: "-8px", peak: 0.58 },
];

function HeroBubbles({ reduceMotion }) {
  if (reduceMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {BUBBLE_RISE.map((b, i) => (
        <span
          key={`rise-${i}`}
          className={`hero-bubble hero-bubble-rise hero-bubble-tone-${b.tone}`}
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            "--bubble-delay": `${b.delay}s`,
            "--bubble-duration": `${b.duration}s`,
            "--bubble-drift": b.drift,
            "--bubble-peak": b.peak,
          }}
        />
      ))}
      {BUBBLE_SWEEP_RTL.map((b, i) => (
        <span
          key={`sweep-rtl-${i}`}
          className={`hero-bubble hero-bubble-sweep hero-bubble-tone-${b.tone}`}
          style={{
            width: b.size,
            height: b.size,
            "--bubble-top": b.top,
            "--bubble-delay": `${b.delay}s`,
            "--bubble-duration": `${b.duration}s`,
            "--bubble-y-shift": b.yShift,
            "--bubble-peak": b.peak,
          }}
        />
      ))}
      {BUBBLE_SWEEP_LTR.map((b, i) => (
        <span
          key={`sweep-ltr-${i}`}
          className={`hero-bubble hero-bubble-sweep-ltr hero-bubble-tone-${b.tone}`}
          style={{
            width: b.size,
            height: b.size,
            "--bubble-top": b.top,
            "--bubble-delay": `${b.delay}s`,
            "--bubble-duration": `${b.duration}s`,
            "--bubble-y-shift": b.yShift,
            "--bubble-peak": b.peak,
          }}
        />
      ))}
    </div>
  );
}

function HeroBackground({ reduceMotion }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="hero-dot-grid-light absolute inset-0" />
      <div className="hero-spotlight absolute inset-0" />

      <div
        className={`absolute -left-[22%] top-[8%] h-[420px] w-[420px] rounded-full bg-blue-400/22 blur-[110px] ${
          reduceMotion ? "" : "hero-ambient-drift"
        }`}
      />
      <div
        className={`absolute -right-[18%] top-[32%] h-[380px] w-[380px] rounded-full bg-indigo-400/18 blur-[105px] ${
          reduceMotion ? "" : "hero-ambient-drift-reverse"
        }`}
      />
      <div
        className={`absolute -bottom-[12%] left-[20%] h-[260px] w-[260px] rounded-full bg-cyan-400/12 blur-[90px] ${
          reduceMotion ? "" : "hero-ambient-drift"
        }`}
        style={reduceMotion ? undefined : { animationDelay: "-6s" }}
      />

      <HeroBubbles reduceMotion={reduceMotion} />

      {!reduceMotion && <div className="hero-beam" />}

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200/90 to-transparent" />
    </div>
  );
}

function HeroSection({ onRegister }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const motionState = reduceMotion
    ? { initial: false, animate: "show" }
    : { initial: "hidden", animate: "show" };

  return (
    <section
      id="HeroSection"
      className="relative overflow-x-hidden bg-slate-50/50 text-zinc-900"
    >
      {/* Nền + bong bóng: full width tới 2 mép màn hình */}
      <HeroBackground reduceMotion={reduceMotion} />

      {/* Khung nội dung: thu hẹp nhẹ so với max-w-7xl, không bó chữ + widget */}
      <div className="relative z-[1] mx-auto w-full max-w-[1120px] px-4 py-20 sm:px-6 md:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div
            className="min-w-0 text-left lg:col-span-7"
            variants={containerVariants}
            {...motionState}
          >
            <motion.div
              variants={itemVariants}
              className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/80 px-4 py-1.5 text-sm text-slate-600 shadow-sm backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                {!reduceMotion && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-30" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              {t("hero.made_for")}
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-5 max-w-xl text-4xl font-semibold tracking-tighter text-zinc-950 sm:text-5xl lg:text-[2.85rem] lg:leading-[1.08] xl:text-[3.25rem]"
            >
              <span className="block">{t("hero.title_line1")}</span>
              <span className="mt-1 block text-gradient-hero">{t("hero.title_line2")}</span>
              <span className="mt-1 block bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {t("hero.title_span")}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mb-9 max-w-md text-base leading-relaxed text-slate-600 md:text-lg"
            >
              {t("hero.description")}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3"
            >
              <motion.a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onRegister?.();
                }}
                className="btn-hero-primary inline-flex shrink-0 items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-[box-shadow,transform] duration-300"
                whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                {t("hero.cta_free")}
              </motion.a>
              <motion.a
                href="#Feature"
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-zinc-800 shadow-sm backdrop-blur-sm transition-colors hover:border-slate-300 hover:bg-white"
                whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                {t("hero.cta_feature")}
              </motion.a>
            </motion.div>
          </motion.div>

          <div className="flex min-w-0 w-full items-center justify-center lg:col-span-5">
            <motion.div
              className="relative w-full max-w-[440px] lg:max-w-full"
              variants={reduceMotion ? widgetVariantsReduced : widgetVariants}
              {...motionState}
            >
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(100%,280px)] w-[min(100%,380px)] -translate-x-1/2 -translate-y-1/2"
                aria-hidden
              >
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-400/15 to-cyan-400/10 blur-[72px] ${
                    reduceMotion ? "" : "hero-widget-glow"
                  }`}
                />
              </div>

              {!reduceMotion && (
                <motion.div
                  className="pointer-events-none absolute -inset-3 -z-[5] rounded-[1.75rem] border border-indigo-200/30 opacity-60"
                  animate={{ opacity: [0.25, 0.55, 0.25] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  aria-hidden
                />
              )}

              <div className="relative z-10 w-full">
                <UploadWidget variant="hero" onProcessAction={onRegister} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
