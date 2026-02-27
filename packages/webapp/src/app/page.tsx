'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MODULES } from '@/lib/constants';

const tileVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.08 + i * 0.07,
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export default function HomePage() {
  return (
    <div className="px-4 pt-6 pb-8 md:px-8 md:pt-8 max-w-3xl mx-auto md:mx-0">
      {/* Mobile logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:hidden mb-6"
      >
        <h1 className="text-[32px] font-extrabold text-[#1A1A2E] tracking-tight leading-10">
          <span className="mr-2" role="img" aria-label="huis">🏠</span>
          KlusAI
        </h1>
        <p className="text-[#6B7280] mt-1">Van idee tot klus</p>
      </motion.div>

      {/* Desktop welcome */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="hidden md:block mb-8"
      >
        <h2 className="text-3xl font-extrabold text-[#1A1A2E] tracking-tight">
          Van idee tot klus
        </h2>
        <p className="text-[#6B7280] mt-1">
          Kies een module om te beginnen met je project.
        </p>
      </motion.div>

      {/* Tile Grid — 2 columns like mobile */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {MODULES.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={mod.key}
              custom={i}
              variants={tileVariants}
              initial="hidden"
              animate="visible"
            >
              <Link href={mod.href} className="block group">
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative aspect-[1/0.85] rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${mod.gradient[0]}, ${mod.gradient[1]})`,
                  }}
                >
                  {/* Subtle glass highlight */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                  {/* Emoji icon */}
                  <span className="text-4xl relative z-10 select-none" role="img">
                    {mod.emoji}
                  </span>

                  {/* Text */}
                  <div className="relative z-10">
                    <span className="block text-white font-bold text-[15px] sm:text-[17px] leading-snug">
                      {mod.label}
                    </span>
                    <span className="block text-white/75 text-[12px] sm:text-[13px] mt-0.5">
                      {mod.description}
                    </span>
                  </div>

                  {/* Hover glow (desktop) */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 80% 20%, ${mod.gradient[0]}40, transparent 70%)`,
                    }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
