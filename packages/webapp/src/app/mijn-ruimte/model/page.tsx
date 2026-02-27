'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { ScanLine, ArrowLeft, Armchair, Download, Maximize2 } from 'lucide-react';

export default function ModelPage() {
  return (
    <Suspense fallback={<div className="px-4 pt-6 pb-8 text-center text-[#9CA3AF]">Laden...</div>}>
      <ModelContent />
    </Suspense>
  );
}

const DIMENSIONS = {
  length: 5.2,
  width: 3.8,
  height: 2.7,
  area: 19.76,
  volume: 53.35,
};

const SEGMENTS = [
  { type: 'Muur', count: 4, area: '48.6 m\u00B2', color: '#F5F0E8' },
  { type: 'Raam', count: 2, area: '3.2 m\u00B2', color: '#B8D4E8' },
  { type: 'Deur', count: 1, area: '1.8 m\u00B2', color: '#C4A882' },
  { type: 'Vloer', count: 1, area: '19.8 m\u00B2', color: '#D4C4A8' },
  { type: 'Plafond', count: 1, area: '19.8 m\u00B2', color: '#FFFFFF' },
];

function ModelContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get('room') || '1';

  return (
    <div>
      <PageHeader
        title="Ruimtemodel"
        subtitle="3D-weergave van je kamer"
        icon={ScanLine}
        gradient={['#00B894', '#55E6C1']}
      />

      <div className="px-4 md:px-8 space-y-4 pb-8">
        <Link
          href="/mijn-ruimte"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A1A2E] transition-colors"
        >
          <ArrowLeft size={16} />
          Terug naar kamers
        </Link>

        {/* 3D model placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-[#F0FFF4] to-[#E8F8F5] rounded-2xl border border-[#00B894]/20 overflow-hidden"
          style={{ aspectRatio: '4/3' }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="text-6xl">{'\uD83E\uDDF1'}</span>
            <p className="text-sm font-bold text-[#1A1A2E]">3D-weergave</p>
            <p className="text-xs text-[#6B7280]">Interactief model wordt hier getoond</p>
          </div>
          <button className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#6B7280] hover:bg-white transition-colors">
            <Maximize2 size={16} />
          </button>
        </motion.div>

        {/* Dimensions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] p-4"
        >
          <h3 className="text-sm font-bold text-[#1A1A2E] mb-3 flex items-center gap-2">
            {'\uD83D\uDCCF'} Afmetingen
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: `${DIMENSIONS.length}m`, label: 'Lengte' },
              { value: `${DIMENSIONS.width}m`, label: 'Breedte' },
              { value: `${DIMENSIONS.height}m`, label: 'Hoogte' },
              { value: `${DIMENSIONS.area} m\u00B2`, label: 'Oppervlakte' },
            ].map((d) => (
              <div
                key={d.label}
                className="bg-[#F9FAFB] rounded-xl p-3 text-center"
              >
                <p className="text-lg font-bold text-[#00B894]">{d.value}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{d.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Segments / Elements */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] p-4"
        >
          <h3 className="text-sm font-bold text-[#1A1A2E] mb-3 flex items-center gap-2">
            {'\uD83C\uDFD7\uFE0F'} Elementen
          </h3>
          <div className="space-y-2">
            {SEGMENTS.map((s, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <div
                  className="w-6 h-6 rounded border border-[#E5E7EB]"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-sm font-medium text-[#1A1A2E] flex-1">{s.type}</span>
                <span className="text-xs text-[#9CA3AF]">{'\u00D7'}{s.count}</span>
                <span className="text-sm font-bold text-[#1A1A2E]">{s.area}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-3"
        >
          <Link
            href={`/mijn-ruimte/meubels?room=${roomId}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #00B894, #55E6C1)' }}
          >
            <Armchair size={18} />
            Meubels plaatsen
          </Link>
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">
            <Download size={18} />
            Exporteren
          </button>
        </motion.div>
      </div>
    </div>
  );
}
