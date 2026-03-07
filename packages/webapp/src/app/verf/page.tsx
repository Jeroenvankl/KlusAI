'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import ColorSwatch from '@/components/paint/ColorSwatch';
import { useCart } from '@/components/paint/PaintCart';
import { getAllColors } from '@/lib/api-client';
import type { PaintColor } from '@/types/api';
import { Paintbrush, Search, ShoppingCart, Palette, ArrowRight, Loader2 } from 'lucide-react';
import clsx from 'clsx';

// Fallback colors when backend is offline
const FALLBACK_COLORS: { hex: string; name: string; brand: string; collection: string | null }[] = [
  { hex: '#F5F0E8', name: 'Warm Wit', brand: 'Flexa', collection: 'Pure' },
  { hex: '#F2EDE3', name: 'Gebroken Wit', brand: 'Flexa', collection: 'Pure' },
  { hex: '#B0C4D8', name: 'Denim Drift', brand: 'Flexa', collection: 'Creations' },
  { hex: '#CACDBE', name: 'Tranquil Dawn', brand: 'Flexa', collection: 'Creations' },
  { hex: '#8B8E8F', name: 'Industrial Grey', brand: 'Flexa', collection: 'Creations' },
  { hex: '#A67B5B', name: 'Brave Ground', brand: 'Flexa', collection: 'Creations' },
  { hex: '#C8D8D8', name: 'Dauwdruppel', brand: 'Sikkens', collection: 'Alpha' },
  { hex: '#D5DFC8', name: 'Lentemist', brand: 'Sikkens', collection: 'Alpha' },
  { hex: '#A0B8C8', name: 'Zachtblauw', brand: 'Gamma Huismerk', collection: 'Premium' },
  { hex: '#9CA88C', name: 'Saliegroen', brand: 'Gamma Huismerk', collection: 'Premium' },
];

type ColorCategory = 'Alle' | 'Groen' | 'Rood & Roze' | 'Aardekleuren' | 'Pastel' | 'Blauw' | 'Grijs' | 'Wit';
const CATEGORIES: ColorCategory[] = ['Alle', 'Groen', 'Rood & Roze', 'Aardekleuren', 'Pastel', 'Blauw', 'Grijs', 'Wit'];

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function getColorCategory(hex: string): ColorCategory[] {
  const { h, s, l } = hexToHSL(hex);
  const cats: ColorCategory[] = [];
  if (l >= 90 && s < 40) cats.push('Wit');
  if (s <= 10 && l >= 20 && l < 90) cats.push('Grijs');
  if (h >= 80 && h <= 170 && s > 8) cats.push('Groen');
  if (((h >= 340 || h <= 20) && s > 12) || (h >= 300 && h < 340 && s > 10)) cats.push('Rood & Roze');
  if (h >= 180 && h <= 260 && s > 8) cats.push('Blauw');
  if (h >= 15 && h <= 55 && s >= 10 && l < 90) cats.push('Aardekleuren');
  if (l > 72 && s >= 10 && s <= 55 && l < 95) cats.push('Pastel');
  return cats;
}

interface DisplayColor {
  hex: string;
  name: string;
  brand: string;
  collection: string | null;
}

export default function VerfPage() {
  const [selectedBrand, setSelectedBrand] = useState('Alle');
  const [selectedCategory, setSelectedCategory] = useState<ColorCategory>('Alle');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [allColors, setAllColors] = useState<DisplayColor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const { totalItems } = useCart();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const colors = await getAllColors({ limit: 50 });
        if (!cancelled) {
          const mapped = colors.map((c: PaintColor) => ({
            hex: c.hex_code,
            name: c.name,
            brand: c.brand,
            collection: c.collection,
          }));
          setAllColors(mapped);
          setHasMore(colors.length >= 50);
          const uniqueBrands = Array.from(new Set(mapped.map((c: DisplayColor) => c.brand)));
          setBrands(uniqueBrands);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setAllColors(FALLBACK_COLORS);
          setBrands(['Flexa', 'Sikkens', 'Gamma Huismerk']);
          setHasMore(false);
          setIsLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const colors = await getAllColors({ limit: 300 });
      const mapped = colors.map((c: PaintColor) => ({
        hex: c.hex_code,
        name: c.name,
        brand: c.brand,
        collection: c.collection,
      }));
      setAllColors(mapped);
      const uniqueBrands = Array.from(new Set(mapped.map((c: DisplayColor) => c.brand)));
      setBrands(uniqueBrands);
      setHasMore(false);
    } catch {
      // keep existing colors
    } finally {
      setIsLoadingMore(false);
    }
  };

  const filteredColors = useMemo(() => {
    return allColors.filter((c) => {
      const matchesBrand = selectedBrand === 'Alle' || c.brand === selectedBrand;
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.hex.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.collection && c.collection.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === 'Alle' || getColorCategory(c.hex).includes(selectedCategory);
      return matchesBrand && matchesSearch && matchesCategory;
    });
  }, [allColors, selectedBrand, searchQuery, selectedCategory]);

  const displayBrands = ['Alle', ...brands];

  function brandLabel(b: string) {
    if (b === 'Gamma Huismerk') return 'Gamma';
    if (b === 'Praxis Huismerk') return 'Praxis';
    if (b === 'Karwei Kleuren') return 'Karwei';
    return b;
  }

  return (
    <div>
      <PageHeader
        title="Verf & Kleuren"
        subtitle="Kleuren kiezen en muren virtueel verven"
        icon={Paintbrush}
        gradient={['#FF6B6B', '#EE5A24']}
      />

      <div className="px-4 md:px-8 space-y-6 pb-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/verf/preview">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-2xl p-4 overflow-hidden shadow-md"
              style={{ background: 'linear-gradient(135deg, #FF6B6B, #EE5A24)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <Palette size={28} className="text-white relative z-10 mb-2" />
              <p className="text-white font-bold text-sm relative z-10">Kleur Preview</p>
              <p className="text-white/70 text-xs relative z-10 mt-0.5">Upload een foto</p>
            </motion.div>
          </Link>
          <Link href="/verf/vergelijk">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-2xl p-4 overflow-hidden shadow-md bg-white border border-[#E5E7EB]"
            >
              <div className="flex items-center gap-1 mb-2">
                <div className="w-5 h-5 rounded-full bg-[#B0C4D8] shadow-sm" />
                <div className="w-5 h-5 rounded-full bg-[#CACDBE] shadow-sm -ml-1.5" />
                <div className="w-5 h-5 rounded-full bg-[#A67B5B] shadow-sm -ml-1.5" />
              </div>
              <p className="text-[#1A1A2E] font-bold text-sm">Vergelijk</p>
              <p className="text-[#9CA3AF] text-xs mt-0.5">Kleuren naast elkaar</p>
            </motion.div>
          </Link>
        </div>

        {/* Cart indicator */}
        {totalItems > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/verf/winkelwagen">
              <div className="flex items-center justify-between bg-[#1A1A2E] rounded-xl px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} />
                  <span className="text-sm font-medium">
                    {totalItems} {totalItems === 1 ? 'kleur' : 'kleuren'} in winkelwagen
                  </span>
                </div>
                <ArrowRight size={16} />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Zoek op kleur, naam of merk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#E5E7EB] text-sm text-[#1A1A2E] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                selectedCategory === cat
                  ? 'bg-[#FF6B6B] text-white shadow-sm'
                  : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#FF6B6B]/30',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Brand Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
          {displayBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={clsx(
                'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                selectedBrand === brand
                  ? 'bg-[#1A1A2E] text-white shadow-sm'
                  : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#1A1A2E]/20',
              )}
            >
              {brandLabel(brand)}
            </button>
          ))}
        </div>

        {/* Colors grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#1A1A2E]">
              {selectedCategory === 'Alle' && !searchQuery ? 'Alle kleuren' : 'Resultaten'}
            </h2>
            <span className="text-xs text-[#9CA3AF]">
              {filteredColors.length} kleur{filteredColors.length !== 1 ? 'en' : ''}
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={24} className="text-[#FF6B6B] animate-spin mb-2" />
              <p className="text-sm text-[#9CA3AF]">Kleuren laden...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedBrand + selectedCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3"
              >
                {filteredColors.map((color) => (
                  <ColorSwatch
                    key={color.hex + color.name}
                    hex={color.hex}
                    name={color.name}
                    brand={color.brand}
                    selected={selectedColor === color.hex}
                    onClick={() => setSelectedColor(selectedColor === color.hex ? null : color.hex)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!isLoading && hasMore && (
            <div className="flex justify-center mt-4">
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="px-6 py-2.5 rounded-xl text-sm font-medium bg-white border border-[#E5E7EB] text-[#1A1A2E] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
              >
                {isLoadingMore ? 'Laden...' : 'Alle kleuren laden'}
              </button>
            </div>
          )}

          {!isLoading && filteredColors.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-[#9CA3AF] py-8"
            >
              Geen kleuren gevonden voor deze zoekopdracht.
            </motion.p>
          )}
        </div>

        {/* Selected Color Detail */}
        <AnimatePresence>
          {selectedColor && (
            <motion.div
              initial={{ opacity: 0, y: 16, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 16, height: 0 }}
              className="overflow-hidden"
            >
              {(() => {
                const color = allColors.find((c) => c.hex === selectedColor);
                if (!color) return null;
                return (
                  <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-xl shadow-md flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-[#1A1A2E]">{color.name}</h3>
                        <p className="text-sm text-[#6B7280]">
                          {brandLabel(color.brand)}
                          {color.collection && <span className="text-[#9CA3AF]"> &middot; {color.collection}</span>}
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5 font-mono">{color.hex}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/verf/preview?color=${encodeURIComponent(color.hex)}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#FF6B6B] text-white text-sm font-medium rounded-xl hover:bg-[#EE5A24] transition-colors"
                      >
                        <Palette size={16} />
                        Preview op muur
                      </Link>
                      <Link
                        href={`/verf/vergelijk?colors=${encodeURIComponent(color.hex)}`}
                        className="px-4 py-2.5 bg-[#F3F4F6] text-[#1A1A2E] text-sm font-medium rounded-xl hover:bg-[#E5E7EB] transition-colors"
                      >
                        Vergelijk
                      </Link>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Color picker */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
          <h2 className="text-base font-bold text-[#1A1A2E] mb-3">
            Kies een eigen kleur
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="color"
              defaultValue="#4A90D9"
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
            />
            <div className="flex-1">
              <p className="text-sm text-[#6B7280]">
                Klik op het kleurvlak om een kleur te kiezen, of voer een hex-code in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
