import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'KlusAI — Slim Klussen met AI',
  description:
    'AI-gedreven klus- en renovatie-assistent. Verf kiezen, kamers analyseren, bouwplannen maken en meer.',
  keywords: ['klussen', 'renovatie', 'AI', 'verf', 'interieur', 'bouwplan'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#4A90D9',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
