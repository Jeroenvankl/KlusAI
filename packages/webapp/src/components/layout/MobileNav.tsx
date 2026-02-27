'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { MODULES } from '@/lib/constants';
import clsx from 'clsx';

// Show Home + first 4 modules in bottom nav
const BOTTOM_NAV = [
  { key: 'home', label: 'Home', href: '/', icon: Home, gradient: ['#4A90D9', '#74B9FF'] as const },
  ...MODULES.slice(0, 4).map((m) => ({ ...m, icon: m.icon })),
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-lg border-t border-[#E5E7EB] pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-center justify-around h-16">
        {BOTTOM_NAV.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={clsx(
                'flex flex-col items-center justify-center gap-0.5 w-full h-full relative',
                isActive ? 'text-[#1A1A2E]' : 'text-[#9CA3AF]',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNav"
                  className="absolute -top-px inset-x-3 h-0.5 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${item.gradient[0]}, ${item.gradient[1]})` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={isActive ? { color: item.gradient[0] } : undefined}
              />
              <span className="text-[10px] font-medium leading-none">
                {item.label.split(' ')[0]}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
