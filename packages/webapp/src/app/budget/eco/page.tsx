'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { Wallet, ArrowLeft, Leaf } from 'lucide-react';

const ECO_TIPS = [
  {
    icon: '\uD83C\uDFA8',
    title: 'Watergedragen verf',
    description: 'Kies verf op waterbasis in plaats van oplosmiddelgebaseerd. Beter voor het milieu en je gezondheid.',
    saving: 'Eco-score: +15%',
    brands: ['Flexa Pure', 'Sikkens Alpha'],
  },
  {
    icon: '\u267B\uFE0F',
    title: 'Gerecyclede materialen',
    description: 'Gebruik gerecycled hout en materialen voor een lagere ecologische voetafdruk.',
    saving: 'Besparing: ~20%',
    brands: ['IKEA Kungsbacka', 'Gamma Eco-lijn'],
  },
  {
    icon: '\uD83D\uDCA1',
    title: 'LED-verlichting',
    description: 'Vervang alle gloei- en halogeenlampen door LED. Lager verbruik en langere levensduur.',
    saving: 'Besparing: \u20AC80/jaar',
    brands: ['Philips Hue', 'IKEA TRADFRI'],
  },
  {
    icon: '\uD83C\uDF21\uFE0F',
    title: 'Isolatie verbeteren',
    description: 'Goede isolatie bespaart op stookkosten en verhoogt je comfortniveau.',
    saving: 'Besparing: \u20AC200-400/jaar',
    brands: ['Isover', 'Rockwool'],
  },
  {
    icon: '\uD83D\uDEBF',
    title: 'Waterbesparende kranen',
    description: 'Installeer waterbesparende douchekoppen en kranen voor een lagere waterrekening.',
    saving: 'Besparing: \u20AC60/jaar',
    brands: ['Grohe', 'Hansgrohe EcoSmart'],
  },
];

export default function EcoPage() {
  return (
    <div>
      <PageHeader
        title="Duurzaam klussen"
        subtitle="Kies slimmer voor het milieu en je portemonnee"
        icon={Wallet}
        gradient={['#FDCB6E', '#F39C12']}
      />

      <div className="px-4 md:px-8 space-y-4 pb-8">
        <Link
          href="/budget"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A1A2E] transition-colors"
        >
          <ArrowLeft size={16} />
          Terug naar overzicht
        </Link>

        {/* Eco score card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex items-center gap-5"
        >
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#27AE60"
                strokeWidth="3"
                strokeDasharray="72, 100"
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: '72, 100' }}
                transition={{ duration: 1.2, ease: 'easeOut' as const }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-[#27AE60]">72%</span>
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1A1A2E]">Jouw Eco-score</h3>
            <p className="text-sm text-[#6B7280] mt-0.5">
              Op basis van je huidige materiaalkeuzes
            </p>
          </div>
        </motion.div>

        {/* Eco tips */}
        <div className="space-y-3">
          {ECO_TIPS.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{tip.icon}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#1A1A2E]">{tip.title}</h3>
                  <span className="text-xs font-medium text-[#27AE60]">{tip.saving}</span>
                </div>
              </div>
              <p className="text-sm text-[#6B7280] mb-3">{tip.description}</p>
              <div className="flex gap-2 flex-wrap">
                {tip.brands.map((brand) => (
                  <span
                    key={brand}
                    className="px-2.5 py-1 rounded-lg bg-[#F3F4F6] text-[11px] font-medium text-[#1A1A2E]"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-medium text-sm shadow-lg active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #27AE60, #2ECC71)' }}
        >
          <Leaf size={18} />
          Bereken mijn totale eco-impact
        </button>
      </div>
    </div>
  );
}
