'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import clsx from 'clsx';

interface ColorSwatchProps {
  hex: string;
  name: string;
  brand?: string;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function ColorSwatch({
  hex,
  name,
  brand,
  selected,
  size = 'md',
  onClick,
}: ColorSwatchProps) {
  const isLight = isLightColor(hex);
  const sizes = {
    sm: 'w-10 h-10 rounded-lg',
    md: 'w-14 h-14 rounded-xl',
    lg: 'w-20 h-20 rounded-2xl',
  };

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 group">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={clsx(
          sizes[size],
          'relative flex items-center justify-center shadow-md transition-shadow',
          selected && 'ring-2 ring-offset-2 ring-[#4A90D9]',
          onClick && 'cursor-pointer',
        )}
        style={{ backgroundColor: hex }}
      >
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Check size={size === 'sm' ? 14 : 18} className={isLight ? 'text-gray-800' : 'text-white'} />
          </motion.div>
        )}
      </motion.div>
      <div className="text-center max-w-[72px]">
        <span className="block text-[11px] font-medium text-[#1A1A2E] leading-tight truncate">
          {name}
        </span>
        {brand && (
          <span className="block text-[10px] text-[#9CA3AF] truncate">{brand}</span>
        )}
      </div>
    </button>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}
