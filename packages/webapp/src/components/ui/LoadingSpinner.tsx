'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  hint?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({
  message = 'Laden...',
  hint,
  color = '#4A90D9',
  size = 'md',
}: LoadingSpinnerProps) {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 48 : 36;

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 size={iconSize} style={{ color }} />
      </motion.div>
      <p className="text-sm font-bold text-[#1A1A2E]">{message}</p>
      {hint && (
        <p className="text-xs text-[#6B7280] text-center max-w-xs px-4">{hint}</p>
      )}
    </div>
  );
}
