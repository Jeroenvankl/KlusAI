'use client';

import { usePathname } from 'next/navigation';
import MobileNav from './MobileNav';
import DesktopSidebar from './DesktopSidebar';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // On the live-hulp page we want a full-screen experience without nav
  const isFullscreen = pathname === '/live-hulp';

  if (isFullscreen) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  return (
    <div className="min-h-dvh bg-[#F5F6FA]">
      <DesktopSidebar />
      <main className="md:ml-64 lg:ml-72 pb-20 md:pb-6">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <MobileNav />
    </div>
  );
}
