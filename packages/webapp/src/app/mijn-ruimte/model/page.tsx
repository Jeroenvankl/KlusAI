'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { ScanLine, ArrowLeft, Armchair, Download, Maximize2, RotateCcw } from 'lucide-react';

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

type RoomView = 'perspective' | 'top' | 'front';

function Room3D({ view }: { view: RoomView }) {
  // Room proportions based on DIMENSIONS, scaled to fit container
  // We use relative units; the container is 100% width with aspect-ratio 4/3
  // Map length->width(x), width->depth(z), height->height(y)
  const scaleW = DIMENSIONS.length; // 5.2m -> x axis
  const scaleD = DIMENSIONS.width;  // 3.8m -> z axis (depth)
  const scaleH = DIMENSIONS.height; // 2.7m -> y axis

  // Normalise to a max of ~220px base unit for the room
  const maxDim = Math.max(scaleW, scaleD, scaleH);
  const unit = 200 / maxDim;

  const W = scaleW * unit; // ~200
  const D = scaleD * unit; // ~146
  const H = scaleH * unit; // ~104

  if (view === 'top') {
    // Top-down 2D view
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="relative border-2 border-[#1A1A2E]/30"
          style={{
            width: `${W}px`,
            height: `${D}px`,
            backgroundColor: SEGMENTS.find(s => s.type === 'Vloer')!.color,
          }}
        >
          {/* Room label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-[#1A1A2E]/60">
              {DIMENSIONS.length}m × {DIMENSIONS.width}m
            </span>
          </div>
          {/* Windows on top wall */}
          <div className="absolute top-0 left-[20%] w-[25%] h-[4px]" style={{ backgroundColor: SEGMENTS.find(s => s.type === 'Raam')!.color, border: '1px solid #7AB8D4' }} />
          <div className="absolute top-0 right-[20%] w-[25%] h-[4px]" style={{ backgroundColor: SEGMENTS.find(s => s.type === 'Raam')!.color, border: '1px solid #7AB8D4' }} />
          {/* Door on bottom wall */}
          <div className="absolute bottom-0 left-[40%] w-[20%] h-[4px]" style={{ backgroundColor: SEGMENTS.find(s => s.type === 'Deur')!.color, border: '1px solid #A08060' }} />
          {/* Wall labels */}
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-[#6B7280]">Achtermuur</span>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-[#6B7280]">Voormuur</span>
          <span className="absolute top-1/2 -left-5 -translate-y-1/2 -rotate-90 text-[10px] text-[#6B7280]">Links</span>
          <span className="absolute top-1/2 -right-5 -translate-y-1/2 rotate-90 text-[10px] text-[#6B7280]">Rechts</span>
        </div>
      </div>
    );
  }

  if (view === 'front') {
    // Front elevation view
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="relative border-2 border-[#1A1A2E]/30"
          style={{
            width: `${W}px`,
            height: `${H}px`,
            backgroundColor: SEGMENTS.find(s => s.type === 'Muur')!.color,
          }}
        >
          {/* Windows */}
          <div
            className="absolute top-[20%] left-[8%] w-[28%] h-[45%] rounded-sm"
            style={{
              backgroundColor: SEGMENTS.find(s => s.type === 'Raam')!.color,
              border: '2px solid #7AB8D4',
              boxShadow: 'inset 0 0 8px rgba(135,206,250,0.3)',
            }}
          >
            {/* Window cross bars */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#7AB8D4]/60" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#7AB8D4]/60" />
          </div>
          <div
            className="absolute top-[20%] right-[8%] w-[28%] h-[45%] rounded-sm"
            style={{
              backgroundColor: SEGMENTS.find(s => s.type === 'Raam')!.color,
              border: '2px solid #7AB8D4',
              boxShadow: 'inset 0 0 8px rgba(135,206,250,0.3)',
            }}
          >
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#7AB8D4]/60" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#7AB8D4]/60" />
          </div>
          {/* Door */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[15%] h-[55%] rounded-t-lg"
            style={{
              backgroundColor: SEGMENTS.find(s => s.type === 'Deur')!.color,
              border: '2px solid #A08060',
              borderBottom: 'none',
            }}
          >
            {/* Door handle */}
            <div className="absolute top-1/2 right-[12%] w-[6px] h-[6px] rounded-full bg-[#8B7355]" />
          </div>
          {/* Dimension labels */}
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-[#6B7280] font-medium">
            {DIMENSIONS.length}m
          </span>
          <span className="absolute top-1/2 -right-5 -translate-y-1/2 rotate-90 text-[10px] text-[#6B7280] font-medium">
            {DIMENSIONS.height}m
          </span>
        </div>
      </div>
    );
  }

  // 3D Perspective view
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div
        style={{
          perspective: '600px',
          perspectiveOrigin: '50% 40%',
          width: `${W + 80}px`,
          height: `${H + 80}px`,
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(12deg) rotateY(-18deg)',
          }}
        >
          {/* Back wall */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              width: `${W}px`,
              height: `${H}px`,
              backgroundColor: SEGMENTS.find(s => s.type === 'Muur')!.color,
              border: '1.5px solid rgba(26,26,46,0.15)',
              transform: `translateZ(-${D / 2}px) translateX(${(W + 80 - W) / 2}px) translateY(${(H + 80 - H) / 2}px)`,
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.05)',
            }}
          >
            {/* Windows on back wall */}
            <div
              className="absolute top-[18%] left-[10%] w-[30%] h-[40%] rounded-sm"
              style={{
                backgroundColor: SEGMENTS.find(s => s.type === 'Raam')!.color,
                border: '2px solid #7AB8D4',
                boxShadow: 'inset 0 0 12px rgba(135,206,250,0.4)',
              }}
            >
              <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[#7AB8D4]/50" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-[#7AB8D4]/50" />
            </div>
            <div
              className="absolute top-[18%] right-[10%] w-[30%] h-[40%] rounded-sm"
              style={{
                backgroundColor: SEGMENTS.find(s => s.type === 'Raam')!.color,
                border: '2px solid #7AB8D4',
                boxShadow: 'inset 0 0 12px rgba(135,206,250,0.4)',
              }}
            >
              <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[#7AB8D4]/50" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-[#7AB8D4]/50" />
            </div>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-[#1A1A2E]/40 whitespace-nowrap">
              Achtermuur
            </span>
          </div>

          {/* Floor */}
          <div
            className="absolute"
            style={{
              width: `${W}px`,
              height: `${D}px`,
              backgroundColor: SEGMENTS.find(s => s.type === 'Vloer')!.color,
              border: '1.5px solid rgba(26,26,46,0.12)',
              transform: `rotateX(90deg) translateZ(${H / 2 + (H + 80 - H) / 2}px) translateX(${(W + 80 - W) / 2}px)`,
              transformOrigin: 'top center',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.06)',
            }}
          >
            {/* Floor boards pattern */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-[1px] bg-[#C4B498]/30"
                style={{ top: `${(i + 1) * (100 / 7)}%` }}
              />
            ))}
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-[#1A1A2E]/40">
              Vloer
            </span>
          </div>

          {/* Ceiling */}
          <div
            className="absolute"
            style={{
              width: `${W}px`,
              height: `${D}px`,
              backgroundColor: SEGMENTS.find(s => s.type === 'Plafond')!.color,
              border: '1.5px solid rgba(26,26,46,0.08)',
              transform: `rotateX(90deg) translateZ(-${H / 2 - (H + 80 - H) / 2}px) translateX(${(W + 80 - W) / 2}px)`,
              transformOrigin: 'top center',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.03)',
            }}
          >
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-[#1A1A2E]/25">
              Plafond
            </span>
          </div>

          {/* Left wall */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              width: `${D}px`,
              height: `${H}px`,
              backgroundColor: SEGMENTS.find(s => s.type === 'Muur')!.color,
              border: '1.5px solid rgba(26,26,46,0.12)',
              transform: `rotateY(90deg) translateZ(-${W / 2 - (W + 80 - W) / 2}px) translateY(${(H + 80 - H) / 2}px)`,
              transformOrigin: 'center center',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.08)',
              filter: 'brightness(0.95)',
            }}
          >
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-[#1A1A2E]/40">
              Linkermuur
            </span>
          </div>

          {/* Right wall */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              width: `${D}px`,
              height: `${H}px`,
              backgroundColor: SEGMENTS.find(s => s.type === 'Muur')!.color,
              border: '1.5px solid rgba(26,26,46,0.12)',
              transform: `rotateY(-90deg) translateZ(-${W / 2 + (W + 80 - W) / 2}px) translateY(${(H + 80 - H) / 2}px)`,
              transformOrigin: 'center center',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.06)',
              filter: 'brightness(0.92)',
            }}
          >
            {/* Door on right wall */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[35%] h-[60%] rounded-t-md"
              style={{
                backgroundColor: SEGMENTS.find(s => s.type === 'Deur')!.color,
                border: '2px solid #A08060',
                borderBottom: 'none',
              }}
            >
              <div className="absolute top-1/2 right-[10%] w-[5px] h-[5px] rounded-full bg-[#8B7355]" />
            </div>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-[#1A1A2E]/40">
              Rechtermuur
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get('room') || '1';
  const [currentView, setCurrentView] = useState<RoomView>('perspective');
  const [showExportToast, setShowExportToast] = useState(false);

  const viewLabels: Record<RoomView, string> = {
    perspective: '3D Perspectief',
    top: 'Bovenaanzicht',
    front: 'Vooraanzicht',
  };

  const viewOrder: RoomView[] = ['perspective', 'top', 'front'];

  const cycleView = () => {
    const currentIndex = viewOrder.indexOf(currentView);
    setCurrentView(viewOrder[(currentIndex + 1) % viewOrder.length]);
  };

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 2500);
  };

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

        {/* 3D Room Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-[#F8FAFE] to-[#EEF2F7] rounded-2xl border border-[#00B894]/20 overflow-hidden"
          style={{ aspectRatio: '4/3' }}
        >
          <Room3D view={currentView} />

          {/* View label */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/80 backdrop-blur-sm text-[11px] font-semibold text-[#1A1A2E]/70">
            {viewLabels[currentView]}
          </div>

          {/* Controls */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={cycleView}
              className="w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#6B7280] hover:bg-white hover:text-[#00B894] transition-colors"
              title="Wissel weergave"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={cycleView}
              className="w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#6B7280] hover:bg-white hover:text-[#00B894] transition-colors"
              title="Volledig scherm"
            >
              <Maximize2 size={16} />
            </button>
          </div>

          {/* View selector pills */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 bg-white/70 backdrop-blur-sm rounded-full p-1">
            {viewOrder.map((v) => (
              <button
                key={v}
                onClick={() => setCurrentView(v)}
                className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
                  currentView === v
                    ? 'bg-[#00B894] text-white shadow-sm'
                    : 'text-[#6B7280] hover:text-[#1A1A2E]'
                }`}
              >
                {v === 'perspective' ? '3D' : v === 'top' ? 'Boven' : 'Voor'}
              </button>
            ))}
          </div>
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
          className="relative flex gap-3"
        >
          <Link
            href={`/mijn-ruimte/meubels?room=${roomId}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #00B894, #55E6C1)' }}
          >
            <Armchair size={18} />
            Meubels plaatsen
          </Link>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
          >
            <Download size={18} />
            Exporteren
          </button>

          {/* Export toast */}
          {showExportToast && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-[#1A1A2E] text-white text-xs font-medium shadow-lg whitespace-nowrap"
            >
              Export functie komt binnenkort
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
