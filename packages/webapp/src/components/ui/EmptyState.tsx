'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  color?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  color = '#9CA3AF',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={24} style={{ color }} />
      </div>
      <h3 className="text-sm font-bold text-[#1A1A2E] mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-[#6B7280] max-w-xs">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-3 px-4 py-2 rounded-lg text-xs font-medium text-white transition-colors active:scale-[0.98]"
          style={{ backgroundColor: color }}
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
