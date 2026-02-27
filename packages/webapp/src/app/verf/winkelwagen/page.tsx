'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { useCart } from '@/components/paint/PaintCart';
import {
  Paintbrush,
  ArrowLeft,
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  ExternalLink,
  PackageOpen,
} from 'lucide-react';

const STORES = [
  { name: 'Gamma', url: 'https://www.gamma.nl/verf', color: '#00A651' },
  { name: 'Praxis', url: 'https://www.praxis.nl/verf-behang', color: '#E2001A' },
  { name: 'IKEA', url: 'https://www.ikea.com/nl', color: '#0051BA' },
  { name: 'Karwei', url: 'https://www.karwei.nl/verf', color: '#FF6600' },
];

export default function WinkelwagenPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  return (
    <div>
      <PageHeader
        title="Winkelwagen"
        subtitle={`${totalItems} ${totalItems === 1 ? 'kleur' : 'kleuren'} geselecteerd`}
        icon={Paintbrush}
        gradient={['#FF6B6B', '#EE5A24']}
      />

      <div className="px-4 md:px-8 space-y-4 pb-8">
        <Link
          href="/verf"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A1A2E] transition-colors"
        >
          <ArrowLeft size={16} />
          Terug naar kleuren
        </Link>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mb-4">
              <PackageOpen size={32} className="text-[#9CA3AF]" />
            </div>
            <h3 className="text-base font-bold text-[#1A1A2E] mb-1">
              Je winkelwagen is leeg
            </h3>
            <p className="text-sm text-[#6B7280] max-w-xs">
              Ga naar de kleur browser of preview om kleuren toe te voegen.
            </p>
            <Link
              href="/verf"
              className="mt-4 px-6 py-2.5 bg-[#FF6B6B] text-white text-sm font-medium rounded-xl hover:bg-[#EE5A24] transition-colors"
            >
              Kleuren bekijken
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Cart items */}
            <div className="space-y-2">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="bg-white rounded-xl border border-[#E5E7EB] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl shadow-md flex-shrink-0"
                        style={{ backgroundColor: item.hex }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1A1A2E] truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#6B7280]">
                          {item.brand} {item.finish ? `· ${item.finish}` : ''}
                        </p>
                        <p className="text-xs font-mono text-[#9CA3AF] mt-0.5">{item.hex}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {item.price != null && (
                          <span className="text-sm font-bold text-[#1A1A2E]">
                            €{(item.price * item.quantity).toFixed(2)}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] hover:bg-[#E5E7EB] transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] hover:bg-[#E5E7EB] transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#EF4444]/60 hover:text-[#EF4444] hover:bg-red-50 transition-colors ml-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Total */}
            {totalPrice > 0 && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6B7280]">Geschatte totaalkosten</span>
                  <span className="text-lg font-bold text-[#1A1A2E]">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-[#EF4444] hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 size={16} />
              Winkelwagen leegmaken
            </button>

            {/* Store links */}
            <div>
              <h3 className="text-sm font-bold text-[#1A1A2E] mb-3">
                Bekijk bij een winkel
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {STORES.map((store) => (
                  <a
                    key={store.name}
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-[#E5E7EB] hover:border-[#4A90D9]/30 hover:shadow-sm transition-all group"
                  >
                    <span
                      className="text-sm font-bold"
                      style={{ color: store.color }}
                    >
                      {store.name}
                    </span>
                    <ExternalLink
                      size={14}
                      className="text-[#9CA3AF] group-hover:text-[#4A90D9] transition-colors"
                    />
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
