'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showSummary, setShowSummary] = useState(false);

  // Calculate totals from the tips' saving values
  const yearlyMoneySavings = [80, 200, 60]; // LED, Isolatie (low end), Waterbesparend
  const totalYearlySaving = yearlyMoneySavings.reduce((a, b) => a + b, 0); // €340
  const materialSavingPercent = 20; // Gerecyclede materialen
  const ecoScoreBoost = 15; // Watergedragen verf

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
          onClick={() => setShowSummary((prev) => !prev)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-medium text-sm shadow-lg active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #27AE60, #2ECC71)' }}
        >
          <Leaf size={18} />
          {showSummary ? 'Verberg eco-impact' : 'Bereken mijn totale eco-impact'}
        </button>

        {/* Eco impact summary */}
        <AnimatePresence>
          {showSummary && (
            <motion.div
              initial={{ opacity: 0, y: 12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-5 space-y-4 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-1">
                <Leaf size={18} className="text-[#27AE60]" />
                <h3 className="text-base font-bold text-[#1A1A2E]">Jouw totale eco-impact</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#D5F5E3] rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-[#27AE60]">{'\u20AC'}{totalYearlySaving}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">Jaarlijkse besparing</p>
                </div>
                <div className="bg-[#D5F5E3] rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-[#27AE60]">+{ecoScoreBoost}%</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">Eco-score boost</p>
                </div>
                <div className="bg-[#D5F5E3] rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-[#27AE60]">~{materialSavingPercent}%</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">Materiaalbesparing</p>
                </div>
                <div className="bg-[#D5F5E3] rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-[#27AE60]">5</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">Tips toegepast</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
                <p className="text-xs font-medium text-[#1A1A2E]">Uitsplitsing jaarlijkse besparing:</p>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">LED-verlichting</span>
                  <span className="font-medium text-[#1A1A2E]">{'\u20AC'}80/jaar</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Isolatie verbeteren</span>
                  <span className="font-medium text-[#1A1A2E]">{'\u20AC'}200/jaar</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Waterbesparende kranen</span>
                  <span className="font-medium text-[#1A1A2E]">{'\u20AC'}60/jaar</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-[#F3F4F6]">
                  <span className="font-bold text-[#1A1A2E]">Totaal</span>
                  <span className="font-bold text-[#27AE60]">{'\u20AC'}{totalYearlySaving}/jaar</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
