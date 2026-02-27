'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  gradient?: readonly [string, string];
  iconColor?: string;
}

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  gradient,
  iconColor,
}: PageHeaderProps) {
  const color = iconColor || (gradient ? gradient[0] : '#4A90D9');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 pt-6 pb-4 md:px-8 md:pt-8"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: gradient
                ? `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`
                : `${color}15`,
            }}
          >
            <Icon
              size={22}
              style={{ color: gradient ? '#fff' : color }}
            />
          </div>
        )}
        <div>
          <h1 className="text-xl font-extrabold text-[#1A1A2E] md:text-2xl">{title}</h1>
          {subtitle && (
            <p className="text-sm text-[#6B7280] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
