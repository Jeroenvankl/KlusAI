'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
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
  Check,
} from 'lucide-react';
import clsx from 'clsx';

export default function AnalysePage() {
  return (
    <Suspense fallback={<div className="px-4 pt-6 pb-8 text-center text-[#9CA3AF]">Laden...</div>}>
      <AnalyseContent />
    </Suspense>
  );
}

/* ── Mock data matching mobile ReverseAnalysisScreen + ReverseShopScreen ── */

const MOCK_RESULT = {
  style: 'Scandinavisch Modern',
  confidence: 92,
  colors: [
    { hex: '#F5F0E8', name: 'Warm Wit', area: 45 },
    { hex: '#8B9E8B', name: 'Salie Groen', area: 20 },
    { hex: '#C4A882', name: 'Naturel Hout', area: 25 },
    { hex: '#2C3E50', name: 'Donker Accent', area: 10 },
  ],
  furniture: [
    { item: 'Bank (3-zits)', match: 'KIVIK - IKEA', price: 599, matchScore: 95 },
    { item: 'Salontafel (rond)', match: 'STOCKHOLM - IKEA', price: 249, matchScore: 88 },
    { item: 'Vloerkleed (jute)', match: 'LOHALS - IKEA', price: 129, matchScore: 92 },
    { item: 'Staande lamp', match: 'HEKTAR - IKEA', price: 49.99, matchScore: 90 },
    { item: 'Kussen set', match: 'GURLI - IKEA', price: 8, matchScore: 85 },
  ],
  materials: [
    { type: 'Muurverf', suggestion: 'Flexa Creations - Sandy Beach', price: 44.99, store: 'Gamma' },
    { type: 'Vloer', suggestion: 'Eiken laminaat Select', price: 24.99, store: 'Gamma' },
  ],
  totalEstimate: 1350,
};

const STORE_FILTERS = [
  { key: 'all', label: 'Alle winkels' },
  { key: 'ikea', label: 'IKEA' },
  { key: 'gamma', label: 'Gamma' },
  { key: 'praxis', label: 'Praxis' },
  { key: 'karwei', label: 'Karwei' },
  { key: 'kwantum', label: 'Kwantum' },
];

const SHOP_ITEMS = [
  { id: '1', name: 'KIVIK 3-zits bank', store: 'IKEA', price: 599, originalItem: 'Bank (3-zits)', matchScore: 95, url: 'https://www.ikea.com/nl/' },
  { id: '2', name: 'STOCKHOLM Salontafel', store: 'IKEA', price: 249, originalItem: 'Salontafel (rond)', matchScore: 88, url: 'https://www.ikea.com/nl/' },
  { id: '3', name: 'LOHALS Vloerkleed jute', store: 'IKEA', price: 129, originalItem: 'Vloerkleed (jute)', matchScore: 92, url: 'https://www.ikea.com/nl/' },
  { id: '4', name: 'Flexa Creations Sandy Beach 5L', store: 'Gamma', price: 44.99, originalItem: 'Muurverf', matchScore: 97, url: 'https://www.gamma.nl/' },
  { id: '5', name: 'HEKTAR Staande lamp', store: 'IKEA', price: 49.99, originalItem: 'Staande lamp', matchScore: 90, url: 'https://www.ikea.com/nl/' },
  { id: '6', name: 'Eiken laminaat Select', store: 'Gamma', price: 24.99, originalItem: 'Vloer (per m²)', matchScore: 85, url: 'https://www.gamma.nl/' },
  { id: '7', name: 'Eiken laminaat Premium', store: 'Praxis', price: 29.99, originalItem: 'Vloer (per m²)', matchScore: 91, url: 'https://www.praxis.nl/' },
];

/* ── Component ── */

function AnalyseContent() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source') || 'upload';

  const [phase, setPhase] = useState<'loading' | 'result' | 'shop'>('loading');
  const [expandedSection, setExpandedSection] = useState<string | null>('colors');
  const [selectedStore, setSelectedStore] = useState('all');

  // Simulate analysis
  useState(() => {
    const timer = setTimeout(() => setPhase('result'), 2200);
    return () => clearTimeout(timer);
  });

  const filteredShop = useMemo(
    () =>
      SHOP_ITEMS.filter(
        (item) => selectedStore === 'all' || item.store.toLowerCase() === selectedStore,
      ),
    [selectedStore],
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

  /* ── Shop view ── */
  if (phase === 'shop') {
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
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#D5F5E3] text-[#27AE60]">
                    {item.matchScore}% match
                  </span>
                  <span className="text-xs text-[#9CA3AF]">Past bij: {item.originalItem}</span>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full py-2 border-t border-[#F3F4F6] text-xs font-medium text-[#0984E3] hover:text-[#0866B3] transition-colors"
                >
                  Bekijk in winkel
                  <ExternalLink size={12} />
                </a>
              </motion.div>
            ))}
          </div>

          {/* Total footer */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#9CA3AF]">{filteredShop.length} producten</p>
              <p className="text-base font-bold text-[#1A1A2E]">Totaal: {'\u20AC'}{shopTotal.toFixed(2)}</p>
            </div>
            <button className="px-4 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: 'linear-gradient(135deg, #0984E3, #74B9FF)' }}>
              {'\uD83D\uDED2'} Alles toevoegen
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Result view ── */
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
          className="rounded-2xl p-5 text-center"
          style={{ background: 'linear-gradient(135deg, #0984E3, #74B9FF)' }}
        >
          <p className="text-xs text-white/80 uppercase tracking-wider">Herkende stijl</p>
          <p className="text-xl font-bold text-white mt-1">{MOCK_RESULT.style}</p>
          <p className="text-sm text-white/80 mt-1">{MOCK_RESULT.confidence}% zekerheid</p>
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
                  {MOCK_RESULT.colors.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 py-1.5">
                      <div
                        className="w-8 h-8 rounded-lg shadow-sm border border-[#E5E7EB]"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-sm font-medium text-[#1A1A2E] flex-1">{c.name}</span>
                      <span className="text-xs font-mono text-[#9CA3AF]">{c.hex}</span>
                      <span className="text-xs text-[#6B7280]">{c.area}%</span>
                    </div>
                  ))}
                  {/* Color strip */}
                  <div className="flex h-3 rounded-full overflow-hidden mt-2">
                    {MOCK_RESULT.colors.map((c, i) => (
                      <div
                        key={i}
                        style={{ backgroundColor: c.hex, width: `${c.area}%` }}
                      />
                    ))}
                  </div>
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
            <span className="text-xs text-[#9CA3AF] mr-1">{MOCK_RESULT.furniture.length}</span>
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
                  {MOCK_RESULT.furniture.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A2E]">{f.item}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{f.match}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="text-sm font-bold text-[#0984E3]">{'\u20AC'}{f.price}</p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#D5F5E3] text-[#27AE60]">
                          {f.matchScore}%
                        </span>
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
                  {MOCK_RESULT.materials.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A2E]">{m.type}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{m.suggestion}</p>
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5">{m.store}</p>
                      </div>
                      <span className="text-sm font-bold text-[#0984E3] flex-shrink-0 ml-3">
                        {'\u20AC'}{m.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Total estimate */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center justify-between"
        >
          <span className="text-sm font-bold text-[#1A1A2E]">Geschatte totaalkosten</span>
          <span className="text-xl font-bold text-[#0984E3]">~{'\u20AC'}{MOCK_RESULT.totalEstimate}</span>
        </motion.div>

        {/* Shop button */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => setPhase('shop')}
          className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl text-white text-sm font-medium active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #0984E3, #74B9FF)' }}
        >
          <ShoppingCart size={18} />
          Bekijk in winkels
        </motion.button>
      </div>
    </div>
  );
}
