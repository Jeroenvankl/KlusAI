'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import ImageUpload from '@/components/paint/ImageUpload';
import { Lightbulb, Sparkles, Camera } from 'lucide-react';
import clsx from 'clsx';
import type { DesignStyle } from '@/types/api';
import { DESIGN_STYLES } from '@/lib/constants';

const STYLE_CARDS: {
  key: DesignStyle;
  color: string;
  description: string;
}[] = [
  { key: 'japandi', color: '#E8DDD0', description: 'Japans minimalisme meets Scandinavisch comfort' },
  { key: 'scandinavisch', color: '#E8EDE4', description: 'Licht, functioneel en gezellig' },
  { key: 'industrieel', color: '#D5D0CB', description: 'Ruw, stoer met warme accenten' },
  { key: 'modern', color: '#D8E0E8', description: 'Strakke lijnen en gedurfde keuzes' },
  { key: 'bohemian', color: '#F0E0D0', description: 'Kleurrijk, eclectisch en persoonlijk' },
  { key: 'minimalistisch', color: '#EDEDED', description: 'Minder is meer, rust en ruimte' },
];

const tileVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: 0.05 + i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function OntwerpPage() {
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null);
  const [roomImage, setRoomImage] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Ontwerp & Inspiratie"
        subtitle="Stijlen ontdekken en AI-suggesties krijgen"
        icon={Lightbulb}
        gradient={['#6C5CE7', '#A29BFE']}
      />

      <div className="px-4 md:px-8 space-y-6 pb-8">
        {/* Room analysis upload */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
          <div className="flex items-center gap-2 mb-3">
            <Camera size={18} className="text-[#6C5CE7]" />
            <h2 className="text-base font-bold text-[#1A1A2E]">Analyseer je ruimte</h2>
          </div>
          <p className="text-sm text-[#6B7280] mb-3">
            Upload een foto van je kamer voor gepersonaliseerde suggesties.
          </p>
          <ImageUpload
            onImageSelect={(_file, dataUrl) => setRoomImage(dataUrl)}
            preview={roomImage}
            onClear={() => setRoomImage(null)}
            aspectRatio="16/9"
          />
        </div>

        {/* Style selection grid */}
        <div>
          <h2 className="text-base font-bold text-[#1A1A2E] mb-3">Kies een stijl</h2>
          <div className="grid grid-cols-2 gap-3">
            {STYLE_CARDS.map((style, i) => {
              const info = DESIGN_STYLES[style.key];
              const isSelected = selectedStyle === style.key;
              return (
                <motion.button
                  key={style.key}
                  custom={i}
                  variants={tileVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setSelectedStyle(isSelected ? null : style.key)}
                  className={clsx(
                    'text-left rounded-2xl p-4 transition-all border-2',
                    isSelected
                      ? 'border-[#6C5CE7] shadow-md'
                      : 'border-transparent hover:border-[#6C5CE7]/20',
                  )}
                  style={{ backgroundColor: style.color }}
                >
                  <span className="text-3xl block mb-1.5">{info.emoji}</span>
                  <p className="text-sm font-bold text-[#1A1A2E]">{info.label}</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5 leading-tight">
                    {style.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Generate button */}
        {selectedStyle && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href={`/ontwerp/resultaat?style=${selectedStyle}${roomImage ? '&hasRoom=1' : ''}`}
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl text-white font-medium text-sm shadow-lg active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)' }}
            >
              <Sparkles size={18} />
              Genereer {DESIGN_STYLES[selectedStyle].label} ontwerp
            </Link>
          </motion.div>
        )}

        {/* Inspiratie previews */}
        <div>
          <h2 className="text-base font-bold text-[#1A1A2E] mb-3">Inspiratie</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                style: 'japandi' as const,
                colors: [
                  { hex: '#F5F0E8', name: 'Warm Wit' },
                  { hex: '#A67B5B', name: 'Aarde' },
                  { hex: '#8B9E8B', name: 'Salie' },
                ],
                tip: 'Combineer lichte muren met warme houten accenten',
              },
              {
                style: 'scandinavisch' as const,
                colors: [
                  { hex: '#FFFFFF', name: 'Wit' },
                  { hex: '#D5DFC8', name: 'Lentemist' },
                  { hex: '#B0C4D8', name: 'Denim' },
                ],
                tip: 'Gebruik lichte tinten en veel natuurlijk licht',
              },
            ].map((item) => (
              <div
                key={item.style}
                className="bg-white rounded-2xl p-4 border border-[#E5E7EB]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{DESIGN_STYLES[item.style].emoji}</span>
                  <span className="text-sm font-bold text-[#1A1A2E]">
                    {DESIGN_STYLES[item.style].label}
                  </span>
                </div>
                <div className="flex gap-1.5 mb-2">
                  {item.colors.map((c) => (
                    <div key={c.hex} className="flex flex-col items-center gap-1">
                      <div
                        className="w-10 h-10 rounded-lg shadow-sm border border-black/5"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-[9px] text-[#9CA3AF]">{c.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#6B7280]">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
