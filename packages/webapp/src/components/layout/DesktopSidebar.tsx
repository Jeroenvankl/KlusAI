'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import clsx from 'clsx';

export default function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col fixed inset-y-0 left-0 z-40 bg-white border-r border-[#E5E7EB]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-6 h-16 border-b border-[#F3F4F6]">
        <span className="text-2xl" role="img" aria-label="huis">🏠</span>
        <div>
          <span className="text-lg font-extrabold text-[#1A1A2E]">KlusAI</span>
          <span className="block text-[10px] text-[#9CA3AF] -mt-0.5 tracking-wide">
            Van idee tot klus
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {/* Home link */}
        <Link
          href="/"
          className={clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-colors',
            pathname === '/'
              ? 'text-[#4A90D9] bg-[#4A90D9]/5'
              : 'text-[#6B7280] hover:text-[#1A1A2E] hover:bg-[#F3F4F6]',
          )}
        >
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#4A90D9]/10">
            <Home size={18} className="text-[#4A90D9]" />
          </span>
          <span>Dashboard</span>
        </Link>

        <div className="h-px bg-[#F3F4F6] my-2" />

        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium relative transition-colors',
                    isActive
                      ? 'text-[#1A1A2E]'
                      : 'text-[#6B7280] hover:text-[#1A1A2E] hover:bg-[#F3F4F6]',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActive"
                      className="absolute inset-0 rounded-xl"
                      style={{ backgroundColor: `${item.gradient[0]}12` }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span
                    className="relative z-10 w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`
                        : `${item.gradient[0]}15`,
                    }}
                  >
                    {isActive ? (
                      <Icon size={16} className="text-white" />
                    ) : (
                      <Icon size={16} style={{ color: item.gradient[0] }} />
                    )}
                  </span>
                  <div className="relative z-10">
                    <span className="block">{item.label}</span>
                    <span className="block text-[11px] text-[#9CA3AF] font-normal">
                      {item.description}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#F3F4F6]">
        <p className="text-[11px] text-[#9CA3AF]">
          KlusAI v1.0 &middot; AI-gestuurd
        </p>
      </div>
    </aside>
  );
}
