'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { Hammer, ArrowLeft, Phone } from 'lucide-react';

const SAFETY_TOPICS = [
  {
    icon: '\uD83E\uDD7D',
    title: 'Persoonlijke bescherming',
    items: [
      'Draag altijd een veiligheidsbril bij het boren of slijpen',
      'Gebruik gehoorbescherming bij luid elektrisch gereedschap',
      'Draag werkhandschoenen bij het werken met scherpe materialen',
      'Gebruik een stofmasker bij het schuren of zagen',
    ],
  },
  {
    icon: '\uD83D\uDD0C',
    title: 'Elektrische veiligheid',
    items: [
      'Schakel altijd de stroom uit bij werkzaamheden aan elektra',
      'Gebruik een spanningtester voor je begint',
      'Laat elektra-werkzaamheden bij twijfel door een vakman doen',
      'Gebruik geen beschadigd gereedschap of snoeren',
    ],
  },
  {
    icon: '\uD83E\uDE9C',
    title: 'Werken op hoogte',
    items: [
      'Gebruik een stabiele ladder op een vlakke ondergrond',
      'Klim nooit op de bovenste twee sporten van een ladder',
      'Bij dakwerk: gebruik altijd een veiligheidsharnas',
      'Werk niet op hoogte bij sterke wind',
    ],
  },
  {
    icon: '\uD83E\uDDEA',
    title: 'Chemische stoffen',
    items: [
      'Werk altijd in een goed geventileerde ruimte',
      'Lees de veiligheidsinformatie op het etiket',
      'Bewaar chemicali\u00EBn buiten bereik van kinderen',
      'Was je handen grondig na het werken met oplosmiddelen',
    ],
  },
  {
    icon: '\uD83D\uDD25',
    title: 'Brandveiligheid',
    items: [
      'Houd een brandblusser binnen handbereik',
      'Bewaar verfblikken en oplosmiddelen op een koele plek',
      'Gooi gebruikte vodden niet in de prullenbak (zelfontbranding!)',
      'Rook niet in de buurt van oplosmiddelen of verf',
    ],
  },
];

export default function VeiligheidPage() {
  return (
    <div>
      <PageHeader
        title="Veiligheidstips"
        subtitle="Veilig klussen is de basis van elk project"
        icon={Hammer}
        gradient={['#E17055', '#D63031']}
      />

      <div className="px-4 md:px-8 space-y-4 pb-8">
        <Link
          href="/bouw"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A1A2E] transition-colors"
        >
          <ArrowLeft size={16} />
          Terug naar projecten
        </Link>

        {/* Emergency card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FEE2E2] rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-[#EF4444]/20 flex items-center justify-center flex-shrink-0">
            <Phone size={22} className="text-[#991B1B]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#991B1B]">In geval van nood</h3>
            <p className="text-xs text-[#991B1B] mt-0.5">Bel 112 voor spoedeisende hulp</p>
            <p className="text-xs text-[#991B1B]">Bel 0800-6060 voor Gifwijzer</p>
          </div>
        </motion.div>

        {/* Safety topics */}
        {SAFETY_TOPICS.map((topic, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.06 }}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{topic.icon}</span>
              <h3 className="text-sm font-bold text-[#1A1A2E]">{topic.title}</h3>
            </div>
            <div className="space-y-2">
              {topic.items.map((item, j) => (
                <div key={j} className="flex items-start gap-2 pl-1">
                  <span className="text-[#E17055] mt-0.5">{'\u2022'}</span>
                  <span className="text-sm text-[#6B7280]">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
