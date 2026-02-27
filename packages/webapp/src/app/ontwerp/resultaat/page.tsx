'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import {
  Lightbulb,
  ArrowLeft,
  Palette,
  Sofa,
  Lamp,
  Flower2,
  Receipt,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { DESIGN_STYLES } from '@/lib/constants';
import type { DesignStyle, DesignSuggestionResponse } from '@/types/api';

export default function ResultaatPage() {
  return (
    <Suspense fallback={<div className="px-4 pt-6 pb-8 text-center text-[#9CA3AF]">Laden...</div>}>
      <ResultaatContent />
    </Suspense>
  );
}

// Placeholder data matching the mobile DesignResultScreen + DesignDetailScreen
function getPlaceholderSuggestion(style: DesignStyle): DesignSuggestionResponse {
  return {
    style: DESIGN_STYLES[style]?.label || style,
    description: `Een ${DESIGN_STYLES[style]?.label || style} ontwerp dat rust en stijl combineert met functionele elementen.`,
    color_palette: [
      { role: 'Basistint', hex_code: '#F5F0E8', paint_name: 'Warm Wit', paint_brand: 'Flexa' },
      { role: 'Accent', hex_code: '#A67B5B', paint_name: 'Brave Ground', paint_brand: 'Flexa' },
      { role: 'Secundair', hex_code: '#8B9E8B', paint_name: 'Salie', paint_brand: 'Sikkens' },
      { role: 'Plafond', hex_code: '#FFFFFF', paint_name: 'Stralend Wit', paint_brand: 'Flexa' },
    ],
    furniture_changes: [
      { action: 'Vervangen', item: 'Zitbank', suggestion: 'Lage bank in lichtgrijs linnen', product_name: 'KIVIK 3-zits', store: 'IKEA', estimated_price: 599 },
      { action: 'Toevoegen', item: 'Salontafel', suggestion: 'Ronde eiken tafel met dunne poten', product_name: 'STOCKHOLM', store: 'IKEA', estimated_price: 249 },
      { action: 'Toevoegen', item: 'Vloerkleed', suggestion: 'Jute kleed in naturel tinten', product_name: 'LOHALS', store: 'IKEA', estimated_price: 129 },
    ],
    lighting_suggestions: [
      'Staande lamp met warme lichtkleur (2700K)',
      'Dimbare plafondlamp voor sfeerverlichting',
      'Accenten met LED-strips achter meubels',
    ],
    accessories: [
      { type: 'Vaas', description: 'Keramische vaas in aardetinten', product_name: 'Handgemaakte vaas', store: 'Sostrene Grene', estimated_price: 29 },
      { type: 'Kussens', description: 'Linnen kussens in neutrale kleuren', product_name: 'VIGDIS kussenhoezen', store: 'IKEA', estimated_price: 15 },
      { type: 'Plant', description: 'Bamboe plantenpot met groene plant', product_name: 'FEJKA kunstplant', store: 'IKEA', estimated_price: 19 },
    ],
    budget_breakdown: [
      { category: 'Verf & afwerking', description: '4 blikken verf + primer', estimated_cost: 185 },
      { category: 'Meubels', description: 'Bank, tafel, kleed', estimated_cost: 977 },
      { category: 'Verlichting', description: '2 lampen + LED', estimated_cost: 210 },
      { category: 'Accessoires', description: 'Vazen, kussens, planten', estimated_cost: 165 },
      { category: 'Textiel', description: 'Gordijnen en plaids', estimated_cost: 120 },
    ],
    total_estimated_cost: 1657,
    mood_keywords: ['rustig', 'warm', 'naturel', 'licht'],
  };
}

function ResultaatContent() {
  const searchParams = useSearchParams();
  const style = (searchParams.get('style') as DesignStyle) || 'japandi';
  const styleInfo = DESIGN_STYLES[style];

  const [suggestion, setSuggestion] = useState<DesignSuggestionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('colors');

  useEffect(() => {
    // Simulate API call — replace with real suggestDesign() when backend is connected
    const timer = setTimeout(() => {
      setSuggestion(getPlaceholderSuggestion(style));
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [style]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Ontwerp & Inspiratie" icon={Lightbulb} gradient={['#6C5CE7', '#A29BFE']} />
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles size={32} className="text-[#6C5CE7]" />
          </motion.div>
          <p className="text-sm font-medium text-[#6B7280]">
            AI genereert je {styleInfo?.label || style} ontwerp...
          </p>
        </div>
      </div>
    );
  }

  if (!suggestion) return null;

  const sections = [
    {
      id: 'colors',
      icon: Palette,
      title: 'Kleurenpalet',
      content: (
        <div className="space-y-3">
          <div className="flex gap-3 flex-wrap">
            {suggestion.color_palette.map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-14 h-14 rounded-xl shadow-md border border-black/5"
                  style={{ backgroundColor: c.hex_code }}
                />
                <span className="text-[11px] font-medium text-[#1A1A2E]">{c.paint_name}</span>
                <span className="text-[10px] text-[#9CA3AF]">{c.role}</span>
              </div>
            ))}
          </div>
          {suggestion.color_palette.map((c, i) => (
            <div key={i} className="flex items-center gap-3 py-1.5">
              <div className="w-7 h-7 rounded-lg border border-black/5" style={{ backgroundColor: c.hex_code }} />
              <div className="flex-1">
                <span className="text-sm font-medium text-[#1A1A2E]">{c.role}</span>
                <span className="text-xs text-[#6B7280] ml-2">{c.paint_name} — {c.paint_brand}</span>
              </div>
              <span className="text-[11px] font-mono text-[#9CA3AF]">{c.hex_code}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'furniture',
      icon: Sofa,
      title: 'Meubelsuggesties',
      content: (
        <div className="space-y-3">
          {suggestion.furniture_changes.map((f, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-[#F3F4F6] last:border-0">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[#6C5CE7]/10 text-[#6C5CE7] font-medium">
                    {f.action}
                  </span>
                  <span className="text-sm font-medium text-[#1A1A2E]">{f.item}</span>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">{f.suggestion}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{f.product_name} · {f.store}</p>
              </div>
              <span className="text-sm font-bold text-[#6C5CE7]">{'\u20AC'}{f.estimated_price}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'lighting',
      icon: Lamp,
      title: 'Verlichting',
      content: (
        <div className="space-y-2">
          {suggestion.lighting_suggestions.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#6C5CE7] mt-0.5">•</span>
              <span className="text-sm text-[#1A1A2E]">{tip}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'accessories',
      icon: Flower2,
      title: 'Accessoires',
      content: (
        <div className="space-y-3">
          {suggestion.accessories.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-[#F3F4F6] last:border-0">
              <div className="flex-1">
                <span className="text-sm font-medium text-[#1A1A2E]">{a.type}</span>
                <p className="text-xs text-[#6B7280] mt-0.5">{a.description}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{a.product_name} · {a.store}</p>
              </div>
              <span className="text-sm font-bold text-[#6C5CE7]">{'\u20AC'}{a.estimated_price}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'budget',
      icon: Receipt,
      title: 'Geschat budget',
      content: (
        <div className="space-y-2">
          {suggestion.budget_breakdown.map((b, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <div>
                <span className="text-sm text-[#1A1A2E]">{b.category}</span>
                <p className="text-[11px] text-[#9CA3AF]">{b.description}</p>
              </div>
              <span className="text-sm font-medium text-[#1A1A2E]">{'\u20AC'}{b.estimated_cost}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 border-t-2 border-[#E5E7EB]">
            <span className="text-base font-bold text-[#1A1A2E]">Totaal</span>
            <span className="text-xl font-bold text-[#6C5CE7]">{'\u20AC'}{suggestion.total_estimated_cost}</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Ontwerpresultaat"
        subtitle={suggestion.description}
        icon={Lightbulb}
        gradient={['#6C5CE7', '#A29BFE']}
      />

      <div className="px-4 md:px-8 space-y-4 pb-8">
        <Link
          href="/ontwerp"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A1A2E] transition-colors"
        >
          <ArrowLeft size={16} />
          Terug naar stijlen
        </Link>

        {/* Style badge + mood keywords */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)' }}
          >
            {styleInfo?.emoji} {suggestion.style}
          </span>
          {suggestion.mood_keywords.map((kw) => (
            <span
              key={kw}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F3F4F6] text-[#6B7280]"
            >
              {kw}
            </span>
          ))}
        </div>

        {/* Expandable sections */}
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;
          return (
            <div key={section.id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/10 flex items-center justify-center">
                  <Icon size={16} className="text-[#6C5CE7]" />
                </div>
                <span className="flex-1 text-sm font-bold text-[#1A1A2E]">{section.title}</span>
                {isExpanded ? (
                  <ChevronUp size={16} className="text-[#9CA3AF]" />
                ) : (
                  <ChevronDown size={16} className="text-[#9CA3AF]" />
                )}
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">{section.content}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
