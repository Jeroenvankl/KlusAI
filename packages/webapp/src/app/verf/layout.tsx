'use client';

import { CartProvider } from '@/components/paint/PaintCart';

export default function VerfLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
