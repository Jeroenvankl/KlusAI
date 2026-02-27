'use client';

import { Suspense, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import ColorSwatch from '@/components/paint/ColorSwatch';
import { useCart } from '@/components/paint/PaintCart';
import {
  Paintbrush,
  ArrowLeft,
  Plus,
  X,
  ShoppingCart,
  Sun,
  Moon,
  Lightbulb,
} from 'lucide-react';
import clsx from 'clsx';

export default function VergelijkPage() {
  return (
    <Suspense fallback={<div className="px-4 pt-6 pb-8 text-center text-[#9CA3AF]">Laden...</div>}>
      <VergelijkContent />
    </Suspense>
  );
}

const PRESET_COLORS = [
  { hex: '#F5F0E8', name: 'Warm Wit', brand: 'Flexa' },
  { hex: '#B0C4D8', name: 'Denim Drift', brand: 'Flexa' },
  { hex: '#CACDBE', name: 'Tranquil Dawn', brand: 'Flexa' },
  { hex: '#8B8E8F', name: 'Industrial Grey', brand: 'Flexa' },
  { hex: '#A67B5B', name: 'Brave Ground', brand: 'Flexa' },
  { hex: '#C8D8D8', name: 'Dauwdruppel', brand: 'Sikkens' },
  { hex: '#D5DFC8', name: 'Lentemist', brand: 'Sikkens' },
  { hex: '#A0B8C8', name: 'Zachtblauw', brand: 'Gamma' },
  { hex: '#9CA88C', name: 'Saliegroen', brand: 'Gamma' },
  { hex: '#F2EDE3', name: 'Gebroken Wit', brand: 'Flexa' },
];

type LightMode = 'day' | 'evening' | 'night';

const LIGHT_MODES: { key: LightMode; label: string; icon: typeof Sun; overlay: string }[] = [
  { key: 'day', label: 'Daglicht', icon: Sun, overlay: '' },
  { key: 'evening', label: 'Avondlicht', icon: Lightbulb, overlay: 'rgba(255, 180, 100, 0.12)' },
  { key: 'night', label: 'Nachtlicht', icon: Moon, overlay: 'rgba(0, 0, 40, 0.15)' },
];

interface CompareColor {
  hex: string;
  name: string;
  brand: string;
}

function VergelijkContent() {
  const searchParams = useSearchParams();
  const initialColor = searchParams.get('colors');

  const [compareColors, setCompareColors] = useState<CompareColor[]>(() => {
    if (initialColor) {
      const preset = PRESET_COLORS.find((c) => c.hex === initialColor);
      return [preset || { hex: initialColor, name: initialColor, brand: '' }];
    }
    return [
      { hex: '#B0C4D8', name: 'Denim Drift', brand: 'Flexa' },
      { hex: '#CACDBE', name: 'Tranquil Dawn', brand: 'Flexa' },
    ];
  });
  const [showPicker, setShowPicker] = useState(false);
  const [lightMode, setLightMode] = useState<LightMode>('day');
  const { addItem } = useCart();

  const addColor = useCallback((color: CompareColor) => {
    setCompareColors((prev) => {
      if (prev.length >= 6) return prev;
      if (prev.some((c) => c.hex === color.hex)) return prev;
      return [...prev, color];
    });
    setShowPicker(false);
  }, []);

  const removeColor = useCallback((hex: string) => {
    setCompareColors((prev) => prev.filter((c) => c.hex !== hex));
  }, []);

  const currentLight = LIGHT_MODES.find((m) => m.key === lightMode)!;

  return (
    <div>
      <PageHeader
        title="Kleurvergelijking"
        subtitle="Vergelijk meerdere kleuren naast elkaar"
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

        {/* Light mode selector */}
        <div className="flex gap-2 bg-white rounded-xl p-1.5 border border-[#E5E7EB]">
          {LIGHT_MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.key}
                onClick={() => setLightMode(mode.key)}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                  lightMode === mode.key
                    ? 'bg-[#FF6B6B] text-white shadow-sm'
                    : 'text-[#6B7280] hover:bg-[#F3F4F6]',
                )}
              >
                <Icon size={14} />
                {mode.label}
              </button>
            );
          })}
        </div>

        {/* Color comparison strips */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-[#E5E7EB]">
          <div className="flex min-h-[240px] sm:min-h-[320px]">
            <AnimatePresence>
              {compareColors.map((color, i) => (
                <motion.div
                  key={color.hex}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: `${100 / compareColors.length}%`, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                  style={{ backgroundColor: color.hex }}
                >
                  {/* Light overlay */}
                  {currentLight.overlay && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ backgroundColor: currentLight.overlay }}
                    />
                  )}

                  {/* Remove button */}
                  {compareColors.length > 1 && (
                    <button
                      onClick={() => removeColor(color.hex)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  )}

                  {/* Color label */}
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/30 to-transparent">
                    <p className="text-white text-xs font-medium truncate">{color.name}</p>
                    {color.brand && (
                      <p className="text-white/70 text-[10px] truncate">{color.brand}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add color button */}
            {compareColors.length < 6 && (
              <motion.button
                onClick={() => setShowPicker(true)}
                className="flex flex-col items-center justify-center min-w-[60px] bg-[#F9FAFB] border-l border-[#E5E7EB] text-[#9CA3AF] hover:text-[#FF6B6B] hover:bg-[#FFF5F5] transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={24} />
                <span className="text-[10px] mt-1">Toevoegen</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Color details table */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left px-4 py-3 text-xs font-bold text-[#1A1A2E]">Kleur</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#1A1A2E]">Naam</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#1A1A2E] hidden sm:table-cell">Merk</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-[#1A1A2E]">Acties</th>
              </tr>
            </thead>
            <tbody>
              {compareColors.map((color) => (
                <tr key={color.hex} className="border-b border-[#F3F4F6] last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-[11px] font-mono text-[#9CA3AF]">{color.hex}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1A1A2E]">{color.name}</td>
                  <td className="px-4 py-3 text-[#6B7280] hidden sm:table-cell">{color.brand || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/verf/preview?color=${encodeURIComponent(color.hex)}`}
                        className="px-2.5 py-1 bg-[#FF6B6B]/10 text-[#FF6B6B] text-xs font-medium rounded-lg hover:bg-[#FF6B6B]/20 transition-colors"
                      >
                        Preview
                      </Link>
                      <button
                        onClick={() =>
                          addItem({
                            id: color.hex,
                            name: color.name,
                            brand: color.brand,
                            hex: color.hex,
                            price: null,
                            finish: null,
                          })
                        }
                        className="p-1.5 text-[#9CA3AF] hover:text-[#1A1A2E] transition-colors"
                      >
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Color picker modal */}
        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
              onClick={() => setShowPicker(false)}
            >
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 max-h-[70vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-[#1A1A2E]">Kleur toevoegen</h3>
                  <button
                    onClick={() => setShowPicker(false)}
                    className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] hover:bg-[#E5E7EB]"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-3 mb-4">
                  {PRESET_COLORS.filter(
                    (c) => !compareColors.some((cc) => cc.hex === c.hex),
                  ).map((color) => (
                    <ColorSwatch
                      key={color.hex}
                      hex={color.hex}
                      name={color.name}
                      brand={color.brand}
                      onClick={() => addColor(color)}
                    />
                  ))}
                </div>

                <div className="border-t border-[#E5E7EB] pt-4">
                  <p className="text-xs text-[#6B7280] mb-2">Of kies een eigen kleur:</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      defaultValue="#4A90D9"
                      id="custom-color"
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('custom-color') as HTMLInputElement;
                        addColor({ hex: input.value, name: input.value, brand: '' });
                      }}
                      className="px-4 py-2 bg-[#FF6B6B] text-white text-sm font-medium rounded-xl hover:bg-[#EE5A24] transition-colors"
                    >
                      Toevoegen
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
