'use client';

import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { reverseAnalyze } from '@/lib/api-client';
import type { ReverseAnalysisResponse } from '@/types/api';
import {
  Camera,
  ArrowLeft,
  Loader2,
  Palette,
  Sofa,
  HardHat,
  ShoppingCart,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  Lightbulb,
  ListChecks,
} from 'lucide-react';
import clsx from 'clsx';

export default function AnalysePage() {
  return (
    <Suspense fallback={<div className="px-4 pt-6 pb-8 text-center text-[#9CA3AF]">Laden...</div>}>
      <AnalyseContent />
    </Suspense>
  );
}

/* ── Mapped types for UI display ── */

interface MappedResult {
  style: string;
  description: string;
  colors: { hex: string; name: string; role: string }[];
  furniture: {
    item: string;
    match: string;
    store: string;
    price: number;
    material: string;
  }[];
  materials: { type: string; description: string }[];
  lighting: { type: string; description: string };
  howToRecreate: string[];
  totalEstimate: number;
}

interface ShopItem {
  id: string;
  name: string;
  store: string;
  price: number;
  originalItem: string;
  material: string;
}

function mapResponseToResult(res: ReverseAnalysisResponse): MappedResult {
  return {
    style: res.style_name,
    description: res.description,
    colors: res.color_palette.map((c) => ({
      hex: c.hex_code,
      name: c.name,
      role: c.role,
    })),
    furniture: res.furniture.map((f) => ({
      item: f.item,
      match: f.estimated_product,
      store: f.store,
      price: f.estimated_price,
      material: f.material,
    })),
    materials: res.materials,
    lighting: res.lighting,
    howToRecreate: res.how_to_recreate,
    totalEstimate: res.total_estimated_cost,
  };
}

function buildShopItems(res: ReverseAnalysisResponse): ShopItem[] {
  const items: ShopItem[] = [];
  res.furniture.forEach((f, i) => {
    items.push({
      id: `furniture-${i}`,
      name: f.estimated_product,
      store: f.store,
      price: f.estimated_price,
      originalItem: f.item,
      material: f.material,
    });
  });
  return items;
}

/* ── Store filters ── */

const STORE_FILTERS = [
  { key: 'all', label: 'Alle winkels' },
  { key: 'ikea', label: 'IKEA' },
  { key: 'gamma', label: 'Gamma' },
  { key: 'praxis', label: 'Praxis' },
  { key: 'karwei', label: 'Karwei' },
  { key: 'kwantum', label: 'Kwantum' },
];

/* ── Component ── */

function AnalyseContent() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source') || 'upload';

  const [phase, setPhase] = useState<'loading' | 'result' | 'shop' | 'error'>('loading');
  const [expandedSection, setExpandedSection] = useState<string | null>('colors');
  const [selectedStore, setSelectedStore] = useState('all');
  const [result, setResult] = useState<MappedResult | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const runAnalysis = useCallback(async () => {
    setPhase('loading');
    setErrorMessage('');

    try {
      // Read the stored image data URL from sessionStorage
      const dataUrl = sessionStorage.getItem('klusai-reverse-image');
      if (!dataUrl) {
        throw new Error('Geen afbeelding gevonden. Ga terug en upload een foto.');
      }

      // Convert data URL back to a File
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type || 'image/jpeg' });

      // Call the real API
      const apiResponse = await reverseAnalyze(file);

      // Map response to UI-friendly format
      setResult(mapResponseToResult(apiResponse));
      setShopItems(buildShopItems(apiResponse));
      setPhase('result');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Er is een onbekende fout opgetreden.';
      setErrorMessage(message);
      setPhase('error');
    }
  }, []);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  const filteredShop = useMemo(
    () =>
      shopItems.filter(
        (item) => selectedStore === 'all' || item.store.toLowerCase() === selectedStore,
      ),
    [selectedStore, shopItems],
  );

  const shopTotal = useMemo(
    () => filteredShop.reduce((sum, item) => sum + item.price, 0),
    [filteredShop],
  );

  const toggleSection = (key: string) => {
    setExpandedSection((prev) => (prev === key ? null : key));
  };

  /* ── Loading state ── */
  if (phase === 'loading') {
    return (
      <div>
        <PageHeader
          title="Analyseren..."
          subtitle="Even geduld"
          icon={Camera}
          gradient={['#0984E3', '#74B9FF']}
        />
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 size={40} className="text-[#0984E3]" />
          </motion.div>
          <p className="text-sm font-bold text-[#1A1A2E]">AI analyseert je foto...</p>
          <p className="text-xs text-[#6B7280] text-center max-w-xs px-4">
            Onze AI herkent stijl, kleuren, meubels en materialen
          </p>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (phase === 'error') {
    return (
      <div>
        <PageHeader
          title="Fout opgetreden"
          subtitle="De analyse is mislukt"
          icon={Camera}
          gradient={['#0984E3', '#74B9FF']}
        />
        <div className="px-4 md:px-8 space-y-4 pb-8">
          <Link
            href="/voorbeeld-nadoen"
            className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A1A2E] transition-colors"
          >
            <ArrowLeft size={16} />
            Terug
          </Link>

          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <p className="text-sm font-bold text-[#1A1A2E] text-center">
              Er ging iets mis
            </p>
            <p className="text-xs text-[#6B7280] text-center max-w-xs px-4">
              {errorMessage}
            </p>
            <button
              onClick={runAnalysis}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, #0984E3, #74B9FF)' }}
            >
              <RotateCcw size={16} />
              Opnieuw proberen
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Shop view ── */
  if (phase === 'shop' && result) {
    return (
      <div>
        <PageHeader
          title="Winkel overzicht"
          subtitle="Producten bij Nederlandse winkels"
          icon={ShoppingCart}
          gradient={['#0984E3', '#74B9FF']}
        />
        <div className="px-4 md:px-8 space-y-4 pb-8">
          <button
            onClick={() => setPhase('result')}
            className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A1A2E] transition-colors"
          >
            <ArrowLeft size={16} />
            Terug naar analyse
          </button>

          {/* Store filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {STORE_FILTERS.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedStore(filter.key)}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                  selectedStore === filter.key
                    ? 'bg-[#0984E3] text-white'
                    : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#0984E3]/30',
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Products */}
          <div className="space-y-3">
            {filteredShop.length === 0 && (
              <p className="text-sm text-[#9CA3AF] text-center py-8">
                Geen producten gevonden voor deze winkel
              </p>
            )}
            {filteredShop.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1A1A2E]">{item.name}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{item.store}</p>
                  </div>
                  <span className="text-base font-bold text-[#0984E3]">
                    {'\u20AC'}{item.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#9CA3AF]">Past bij: {item.originalItem}</span>
                </div>
                {item.material && (
                  <p className="text-[11px] text-[#9CA3AF]">Materiaal: {item.material}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Total footer */}
          {filteredShop.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#9CA3AF]">{filteredShop.length} producten</p>
                <p className="text-base font-bold text-[#1A1A2E]">Totaal: {'\u20AC'}{shopTotal.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Result view ── */
  if (!result) return null;

  return (
    <div>
      <PageHeader
        title="Analyse resultaat"
        subtitle={`Bron: ${source === 'pinterest' ? 'Pinterest' : source === 'gallery' ? 'Galerij' : source === 'screenshot' ? 'Screenshot' : 'Upload'}`}
        icon={Camera}
        gradient={['#0984E3', '#74B9FF']}
      />

      <div className="px-4 md:px-8 space-y-4 pb-8">
        <Link
          href="/voorbeeld-nadoen"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A1A2E] transition-colors"
        >
          <ArrowLeft size={16} />
          Terug
        </Link>

        {/* Style identification */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg, #0984E3, #74B9FF)' }}
        >
          <p className="text-xs text-white/80 uppercase tracking-wider">Herkende stijl</p>
          <p className="text-xl font-bold text-white mt-1">{result.style}</p>
          <p className="text-sm text-white/80 mt-1">{result.description}</p>
        </motion.div>

        {/* Colors found */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden"
        >
          <button
            onClick={() => toggleSection('colors')}
            className="flex items-center gap-2 w-full p-4 text-left"
          >
            <Palette size={16} className="text-[#0984E3]" />
            <span className="flex-1 text-sm font-bold text-[#1A1A2E]">Gevonden kleuren</span>
            {expandedSection === 'colors' ? (
              <ChevronUp size={14} className="text-[#9CA3AF]" />
            ) : (
              <ChevronDown size={14} className="text-[#9CA3AF]" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === 'colors' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2">
                  {result.colors.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 py-1.5">
                      <div
                        className="w-8 h-8 rounded-lg shadow-sm border border-[#E5E7EB]"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-[#1A1A2E] block">{c.name}</span>
                        <span className="text-[11px] text-[#9CA3AF]">{c.role}</span>
                      </div>
                      <span className="text-xs font-mono text-[#9CA3AF]">{c.hex}</span>
                    </div>
                  ))}
                  {/* Color strip */}
                  {result.colors.length > 0 && (
                    <div className="flex h-3 rounded-full overflow-hidden mt-2">
                      {result.colors.map((c, i) => (
                        <div
                          key={i}
                          className="flex-1"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Furniture matches */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden"
        >
          <button
            onClick={() => toggleSection('furniture')}
            className="flex items-center gap-2 w-full p-4 text-left"
          >
            <Sofa size={16} className="text-[#0984E3]" />
            <span className="flex-1 text-sm font-bold text-[#1A1A2E]">Meubel matches</span>
            <span className="text-xs text-[#9CA3AF] mr-1">{result.furniture.length}</span>
            {expandedSection === 'furniture' ? (
              <ChevronUp size={14} className="text-[#9CA3AF]" />
            ) : (
              <ChevronDown size={14} className="text-[#9CA3AF]" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === 'furniture' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2">
                  {result.furniture.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A2E]">{f.item}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{f.match}</p>
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5">{f.store} &middot; {f.material}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="text-sm font-bold text-[#0984E3]">{'\u20AC'}{f.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Materials */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden"
        >
          <button
            onClick={() => toggleSection('materials')}
            className="flex items-center gap-2 w-full p-4 text-left"
          >
            <HardHat size={16} className="text-[#0984E3]" />
            <span className="flex-1 text-sm font-bold text-[#1A1A2E]">Materialen</span>
            {expandedSection === 'materials' ? (
              <ChevronUp size={14} className="text-[#9CA3AF]" />
            ) : (
              <ChevronDown size={14} className="text-[#9CA3AF]" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === 'materials' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2">
                  {result.materials.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A2E]">{m.type}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{m.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Lighting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden"
        >
          <button
            onClick={() => toggleSection('lighting')}
            className="flex items-center gap-2 w-full p-4 text-left"
          >
            <Lightbulb size={16} className="text-[#0984E3]" />
            <span className="flex-1 text-sm font-bold text-[#1A1A2E]">Verlichting</span>
            {expandedSection === 'lighting' ? (
              <ChevronUp size={14} className="text-[#9CA3AF]" />
            ) : (
              <ChevronDown size={14} className="text-[#9CA3AF]" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === 'lighting' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4">
                  <p className="text-sm font-medium text-[#1A1A2E]">{result.lighting.type}</p>
                  <p className="text-xs text-[#6B7280] mt-1">{result.lighting.description}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* How to recreate */}
        {result.howToRecreate.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden"
          >
            <button
              onClick={() => toggleSection('howto')}
              className="flex items-center gap-2 w-full p-4 text-left"
            >
              <ListChecks size={16} className="text-[#0984E3]" />
              <span className="flex-1 text-sm font-bold text-[#1A1A2E]">Hoe na te maken</span>
              {expandedSection === 'howto' ? (
                <ChevronUp size={14} className="text-[#9CA3AF]" />
              ) : (
                <ChevronDown size={14} className="text-[#9CA3AF]" />
              )}
            </button>
            <AnimatePresence>
              {expandedSection === 'howto' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    {result.howToRecreate.map((step, i) => (
                      <div key={i} className="flex gap-3 py-1">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0984E3]/10 text-[#0984E3] flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <p className="text-sm text-[#1A1A2E] pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Total estimate */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center justify-between"
        >
          <span className="text-sm font-bold text-[#1A1A2E]">Geschatte totaalkosten</span>
          <span className="text-xl font-bold text-[#0984E3]">~{'\u20AC'}{result.totalEstimate.toFixed(2)}</span>
        </motion.div>

        {/* Shop button */}
        {shopItems.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setPhase('shop')}
            className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl text-white text-sm font-medium active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #0984E3, #74B9FF)' }}
          >
            <ShoppingCart size={18} />
            Bekijk in winkels
          </motion.button>
        )}
      </div>
    </div>
  );
}
