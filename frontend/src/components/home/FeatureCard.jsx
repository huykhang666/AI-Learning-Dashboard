import { motion } from "motion/react";

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
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

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-white/60 rounded-2xl p-6 border border-zinc-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-zinc-300 hover:bg-white transition-all duration-300 backdrop-blur-md overflow-hidden"
    >
      {/* Hiệu ứng ánh sáng bóng quét qua khi hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />
      
      {/* Vòng hào quang/hộp icon cao cấp */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50/80 to-blue-50/30 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:from-indigo-100 group-hover:to-blue-100 transition-all duration-300 border border-indigo-100/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_12px_rgba(79,70,229,0.03)]">
        {Icon && (
          <Icon
            size={22}
            className="text-indigo-600 group-hover:text-blue-600 transition-colors duration-300"
          />
        )}
      </div>
      
      <h3 className="font-semibold text-zinc-950 mb-2 tracking-tight text-base group-hover:text-indigo-900 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-600 transition-colors duration-300">
        {description}
      </p>
    </motion.div>
  );
}

export default FeatureCard;