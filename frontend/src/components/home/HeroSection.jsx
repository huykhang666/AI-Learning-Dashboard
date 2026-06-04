"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import UploadWidget from "../common/UpLoadWidget";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const widgetVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 16,
      mass: 0.8,
      delay: 0.18,
    },
  },
};

const widgetVariantsReduced = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  show: { opacity: 1, y: 0, scale: 1 },
};

function createBubble(createdAtVal, delayOffset = 0) {
  return {
    id: `${Math.random()}-${createdAtVal}-${delayOffset}`,
    top: `${Math.floor(Math.random() * 85) + 5}%`, // Phân bố từ 5% đến 90% chiều cao
    size: Math.floor(Math.random() * 26) + 14, // Kích thước từ 14px đến 40px
    tone: Math.floor(Math.random() * 7), // 0 đến 6 đại diện cho đủ 7 màu cầu vồng
    duration: Math.random() * 5 + 9, // Thời gian chạy từ 9s đến 14s (bay khá mượt)
    yShift: Math.random() * 80 - 40, // Độ dao động trục Y từ -40px đến 40px
    delay: Math.random() * 1.5 + delayOffset, // Thời gian trễ ra mắt
    peak: Math.random() * 0.12 + 0.68, // Độ hiển thị tối đa của bong bóng (0.68 đến 0.80 - rất rõ nét)
    createdAt: createdAtVal,
    initialX: "-10vw",
  };
}

function HeroBubbles({ reduceMotion }) {
  if (reduceMotion) return null;

  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const now = Date.now();
    const initialBubbles = [];

    // Khởi tạo các bong bóng ban đầu đã bay được 1 phần chặng đường để màn hình có bóng ngay khi load
    // Wave 1: Đã bay 1/3 chặng đường
    const wave1Count = Math.floor(Math.random() * 3) + 6; // 6-8 bóng
    for (let i = 0; i < wave1Count; i++) {
      initialBubbles.push({
        ...createBubble(now - 5000, 0),
        initialX: "30vw",
      });
    }

    // Wave 2: Đã bay 2/3 chặng đường
    const wave2Count = Math.floor(Math.random() * 3) + 6; // 6-8 bóng
    for (let i = 0; i < wave2Count; i++) {
      initialBubbles.push({
        ...createBubble(now - 9000, 0),
        initialX: "65vw",
      });
    }

    // Wave 3: Mới xuất phát ở rìa trái
    const wave3Count = Math.floor(Math.random() * 3) + 6; // 6-8 bóng
    for (let i = 0; i < wave3Count; i++) {
      initialBubbles.push({
        ...createBubble(now, 0),
        initialX: "-10vw",
      });
    }

    setBubbles(initialBubbles);

    // Kích hoạt sóng phát hành bóng mới: mỗi 2.2 giây phát hành thêm 1 lượt chứa 5 - 7 bong bóng
    const interval = setInterval(() => {
      setBubbles((prev) => {
        const currentTime = Date.now();
        // Giữ lại các bóng chưa hoàn thành (thời gian bay tối đa 16s)
        const activeBubbles = prev.filter((b) => currentTime - b.createdAt < 18000);

        const count = Math.floor(Math.random() * 3) + 5; // Luôn ra 5 - 7 bong bóng 1 lượt
        const newWave = [];
        for (let j = 0; j < count; j++) {
          newWave.push({
            ...createBubble(currentTime, 0),
            initialX: "-10vw",
          });
        }
        return [...activeBubbles, ...newWave];
      });
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {bubbles.map((b) => (
        <motion.span
          key={b.id}
          className={`hero-bubble hero-bubble-tone-${b.tone}`}
          style={{
            position: "absolute",
            width: b.size,
            height: b.size,
            top: b.top,
            left: 0,
            background: "linear-gradient(135deg, var(--bubble-from), var(--bubble-to))",
          }}
          initial={{ x: b.initialX, y: 0, opacity: 0, scale: 0.8 }}
          animate={{
            x: "115vw",
            y: [0, b.yShift / 2, -b.yShift, b.yShift, 0],
            opacity: [0, b.peak, b.peak, b.peak * 0.6, 0],
            scale: [0.8, 1, 1.05, 0.95, 0.8],
          }}
          transition={{
            duration: b.duration * (b.initialX === "-10vw" ? 1 : b.initialX === "30vw" ? 0.65 : 0.35),
            delay: b.initialX === "-10vw" ? b.delay : 0,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function HeroBackground({ reduceMotion }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="hero-dot-grid-light absolute inset-0 opacity-80" />
      <div className="hero-spotlight absolute inset-0 opacity-90" />

      {/* Hiệu ứng ánh sáng nền mờ cao cấp của Apple */}
      <div
        className={`absolute -left-[10%] top-[5%] h-[500px] w-[500px] rounded-full bg-blue-400/12 blur-[120px] ${
          reduceMotion ? "" : "hero-ambient-drift"
        }`}
      />
      <div
        className={`absolute -right-[8%] top-[20%] h-[450px] w-[450px] rounded-full bg-indigo-400/10 blur-[110px] ${
          reduceMotion ? "" : "hero-ambient-drift-reverse"
        }`}
      />
      <div
        className={`absolute -bottom-[8%] left-[25%] h-[320px] w-[320px] rounded-full bg-cyan-400/8 blur-[100px] ${
          reduceMotion ? "" : "hero-ambient-drift"
        }`}
        style={reduceMotion ? undefined : { animationDelay: "-6s" }}
      />

      <HeroBubbles reduceMotion={reduceMotion} />

      {!reduceMotion && <div className="hero-beam opacity-40" />}

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-200/80 to-transparent" />
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
      className="relative overflow-x-hidden bg-slate-50/40 text-zinc-900 min-h-[90dvh] flex items-center"
    >
      {/* Nền + bong bóng: phủ rộng toàn màn hình */}
      <HeroBackground reduceMotion={reduceMotion} />

      {/* Khung nội dung tối giản và thoáng đãng */}
      <div className="relative z-[1] mx-auto w-full max-w-[1120px] px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <motion.div
            className="min-w-0 text-left lg:col-span-7"
            variants={containerVariants}
            {...motionState}
          >
            {/* Huy hiệu mini (Eyebrow Badge) chuẩn Apple */}
            <motion.div
              variants={itemVariants}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-zinc-600 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                {!reduceMotion && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500/30 opacity-75" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              {t("hero.made_for")}
            </motion.div>

            {/* Tiêu đề chính tối giản, gộp thành 2 dòng trôi chảy */}
            <motion.h1
              variants={itemVariants}
              className="mb-6 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12] xl:text-[3.75rem]"
            >
              <span>{t("hero.title_line1")}</span>{" "}
              <span className="block mt-1 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {t("hero.title_line2")} {t("hero.title_span")}
              </span>
            </motion.h1>

            {/* Đoạn mô tả thoáng đãng */}
            <motion.p
              variants={itemVariants}
              className="mb-8 max-w-lg text-base leading-relaxed text-zinc-600 md:text-lg"
            >
              {t("hero.description")}
            </motion.p>

            {/* Các CTAs xúc giác cao cấp */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4.5"
            >
              <motion.a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onRegister?.();
                }}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(79,70,229,0.4)] hover:shadow-[0_12px_28px_-6px_rgba(79,70,229,0.5)] border-0 transition-colors"
                whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                {t("hero.cta_free")}
              </motion.a>
              <motion.a
                href="#Feature"
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white/70 px-7 py-3.5 text-sm font-semibold text-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-sm hover:border-zinc-300 hover:bg-white hover:text-zinc-950 transition-colors"
                whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                {t("hero.cta_feature")}
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Cột chứa Widget tải lên */}
          <div className="flex min-w-0 w-full items-center justify-center lg:col-span-5">
            <motion.div
              className="relative w-full max-w-[440px] lg:max-w-full"
              variants={reduceMotion ? widgetVariantsReduced : widgetVariants}
              {...motionState}
            >
              {/* Vùng tỏa sáng mờ sau Widget */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(110%,320px)] w-[min(110%,420px)] -translate-x-1/2 -translate-y-1/2"
                aria-hidden
              >
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/15 via-indigo-400/10 to-cyan-400/8 blur-[72px] ${
                    reduceMotion ? "" : "hero-widget-glow"
                  }`}
                />
              </div>

              {/* Viền sáng bao quanh cao cấp */}
              {!reduceMotion && (
                <motion.div
                  className="pointer-events-none absolute -inset-4 -z-[5] rounded-[2.25rem] border border-blue-500/10 bg-blue-500/[0.01] opacity-60"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  aria-hidden
                />
              )}

              {/* Hộp kính mờ Bento (Glassmorphism Widget Box) */}
              <div className="relative z-10 w-full rounded-[2rem] border border-zinc-200/60 bg-white/70 p-1.5 shadow-[0_24px_50px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-xl">
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
