'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { Wallet, ArrowLeft, Plus, Trash2, Lightbulb } from 'lucide-react';

interface CostItem {
  id: string;
  label: string;
  amount: number;
}

const INITIAL_ITEMS: CostItem[] = [
  { id: '1', label: 'Verf (3 blikken)', amount: 89.97 },
  { id: '2', label: 'Kwasten & rollers', amount: 24.50 },
  { id: '3', label: 'Afplaktape', amount: 8.99 },
  { id: '4', label: 'Grondverf', amount: 32.00 },
];

const SAVING_TIPS = [
  'Vergelijk prijzen tussen Gamma, Praxis en Karwei',
  'Koop verf in grotere blikken voor een lagere literprijs',
  'Hergebruik kwasten door ze goed schoon te maken',
  'Let op actiefolders en kortingscodes',
];

export default function CalculatorPage() {
  const [items, setItems] = useState<CostItem[]>(INITIAL_ITEMS);
  const [newLabel, setNewLabel] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const addItem = () => {
    if (!newLabel || !newAmount) return;
    setItems([
      ...items,
      { id: Date.now().toString(), label: newLabel, amount: parseFloat(newAmount) || 0 },
    ]);
    setNewLabel('');
    setNewAmount('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <PageHeader
        title="Budgetcalculator"
        subtitle="Bereken en beheer je projectkosten"
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

        {/* Cost items */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
          <h3 className="text-sm font-bold text-[#1A1A2E] mb-3">Kostenposten</h3>

          <div className="space-y-1">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12, height: 0 }}
                  className="flex items-center gap-2 py-2.5 border-b border-[#F3F4F6] last:border-0"
                >
                  <span className="flex-1 text-sm text-[#1A1A2E]">{item.label}</span>
                  <span className="text-sm font-medium text-[#1A1A2E] tabular-nums">
                    {'\u20AC'}{item.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#EF4444]/50 hover:text-[#EF4444] hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Add new */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-[#E5E7EB]">
            <input
              type="text"
              placeholder="Omschrijving"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              className="flex-1 px-3 py-2 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-sm text-[#1A1A2E] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F39C12]/30"
            />
            <input
              type="number"
              placeholder={'\u20AC'}
              step="0.01"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              className="w-24 px-3 py-2 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-sm text-[#1A1A2E] text-right placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F39C12]/30"
            />
            <button
              onClick={addItem}
              className="w-10 h-10 rounded-lg bg-[#F39C12] text-white flex items-center justify-center hover:bg-[#E67E22] transition-colors flex-shrink-0"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex items-center justify-between">
          <span className="text-base font-bold text-[#1A1A2E]">Totaal geschat</span>
          <motion.span
            key={total}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-[#F39C12]"
          >
            {'\u20AC'}{total.toFixed(2)}
          </motion.span>
        </div>

        {/* Saving tips */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-[#F39C12]" />
            <h3 className="text-sm font-bold text-[#1A1A2E]">Bespaartips</h3>
          </div>
          <div className="space-y-2">
            {SAVING_TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#F39C12] mt-0.5">{'\u2022'}</span>
                <span className="text-sm text-[#6B7280]">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
