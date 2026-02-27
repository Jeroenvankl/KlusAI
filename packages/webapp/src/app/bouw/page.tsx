'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { Hammer, ChevronRight, AlertTriangle, Bot } from 'lucide-react';
import clsx from 'clsx';

const PROJECT_TEMPLATES = [
  { key: 'wall', icon: '\uD83E\uDDF1', title: 'Muur schilderen', difficulty: 'Beginner', hours: '3-5 uur' },
  { key: 'floor', icon: '\uD83E\uDEB5', title: 'Laminaat leggen', difficulty: 'Gemiddeld', hours: '6-10 uur' },
  { key: 'shelves', icon: '\uD83D\uDCD0', title: 'Planken ophangen', difficulty: 'Beginner', hours: '1-2 uur' },
  { key: 'bathroom', icon: '\uD83D\uDEBF', title: 'Badkamer tegelen', difficulty: 'Gevorderd', hours: '20-30 uur' },
  { key: 'kitchen', icon: '\uD83C\uDF73', title: 'Keuken achterwand', difficulty: 'Gemiddeld', hours: '4-6 uur' },
  { key: 'garden', icon: '\uD83C\uDF3F', title: 'Schutting plaatsen', difficulty: 'Gemiddeld', hours: '8-12 uur' },
];

const difficultyColors: Record<string, { bg: string; text: string }> = {
  Beginner: { bg: '#D5F5E3', text: '#27AE60' },
  Gemiddeld: { bg: '#FEF3C7', text: '#F59E0B' },
  Gevorderd: { bg: '#FEE2E2', text: '#EF4444' },
};

export default function BouwPage() {
  const [customDesc, setCustomDesc] = useState('');

  return (
    <div>
      <PageHeader
        title="Bouw & Klushulp"
        subtitle="Stap-voor-stap instructies voor elk klusproject"
        icon={Hammer}
        gradient={['#E17055', '#D63031']}
      />

      <div className="px-4 md:px-8 space-y-6 pb-8">
        {/* AI Plan generator */}
        <div className="bg-white rounded-2xl border-2 border-[#E17055] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bot size={20} className="text-[#E17055]" />
            <h2 className="text-base font-bold text-[#1A1A2E]">AI Klusplan generator</h2>
          </div>
          <p className="text-sm text-[#6B7280] mb-3">
            Beschrijf je project en krijg een compleet stappenplan met materialen, gereedschap en kosten.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Bijv. 'Ik wil mijn badkamer opknappen...'"
              value={customDesc}
              onChange={(e) => setCustomDesc(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] text-sm text-[#1A1A2E] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E17055]/30 focus:border-[#E17055]"
            />
            <Link
              href={`/bouw/plan?type=custom&desc=${encodeURIComponent(customDesc)}`}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-medium flex-shrink-0 active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, #E17055, #D63031)' }}
            >
              Genereer
            </Link>
          </div>
        </div>

        {/* Project templates */}
        <div>
          <h2 className="text-base font-bold text-[#1A1A2E] mb-3">Populaire projecten</h2>
          <div className="space-y-2">
            {PROJECT_TEMPLATES.map((template, i) => {
              const dc = difficultyColors[template.difficulty];
              return (
                <motion.div
                  key={template.key}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/bouw/plan?type=${template.key}`}>
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex items-center gap-3 hover:shadow-sm transition-shadow group">
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-bold text-[#1A1A2E] block">{template.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded"
                            style={{ backgroundColor: dc.bg, color: dc.text }}
                          >
                            {template.difficulty}
                          </span>
                          <span className="text-[11px] text-[#9CA3AF]">{'\u23F1'} {template.hours}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#9CA3AF] group-hover:text-[#E17055] transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Safety link */}
        <Link href="/bouw/veiligheid">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center gap-3 bg-[#FEF3C7] rounded-xl p-4"
          >
            <AlertTriangle size={22} className="text-[#92400E]" />
            <div className="flex-1">
              <span className="text-sm font-bold text-[#92400E]">Veiligheidstips bekijken</span>
              <p className="text-xs text-[#B45309] mt-0.5">Veilig klussen is de basis van elk project</p>
            </div>
            <ChevronRight size={16} className="text-[#92400E]" />
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
