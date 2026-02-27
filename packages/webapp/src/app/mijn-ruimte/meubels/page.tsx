'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { Armchair, ArrowLeft, Search, Plus } from 'lucide-react';
import clsx from 'clsx';

const CATEGORIES = [
  { key: 'all', label: 'Alles' },
  { key: 'seating', label: 'Zitmeubels' },
  { key: 'tables', label: 'Tafels' },
  { key: 'storage', label: 'Opbergen' },
  { key: 'lighting', label: 'Verlichting' },
  { key: 'decor', label: 'Decoratie' },
];

const FURNITURE_ITEMS = [
  { id: '1', name: 'KIVIK Zitbank', brand: 'IKEA', price: 599, category: 'seating', icon: '\uD83D\uDECB\uFE0F' },
  { id: '2', name: 'LACK Salontafel', brand: 'IKEA', price: 29.99, category: 'tables', icon: '\uD83E\uDEB5' },
  { id: '3', name: 'KALLAX Stellingkast', brand: 'IKEA', price: 79, category: 'storage', icon: '\uD83D\uDCDA' },
  { id: '4', name: 'HEKTAR Vloerlamp', brand: 'IKEA', price: 49.99, category: 'lighting', icon: '\uD83D\uDCA1' },
  { id: '5', name: 'Eetkamerstoel', brand: 'Kwantum', price: 89, category: 'seating', icon: '\uD83E\uDE91' },
  { id: '6', name: 'Dressoir Eiken', brand: 'Kwantum', price: 349, category: 'storage', icon: '\uD83D\uDDC4\uFE0F' },
  { id: '7', name: 'Hanglamp Industrieel', brand: 'Kwantum', price: 59.99, category: 'lighting', icon: '\uD83D\uDD26' },
  { id: '8', name: 'Spiegel Rond', brand: 'IKEA', price: 39.99, category: 'decor', icon: '\uD83E\uDE9E' },
];

export default function MeubelsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [placed, setPlaced] = useState<string[]>([]);

  const filtered = useMemo(
    () =>
      FURNITURE_ITEMS.filter((item) => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [selectedCategory, searchQuery],
  );

  const togglePlace = (id: string) => {
    setPlaced((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  return (
    <div>
      <PageHeader
        title="Meubelbibliotheek"
        subtitle="Plaats meubels in je digitale ruimte"
        icon={Armchair}
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

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Zoek meubels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-[#E5E7EB] text-sm text-[#1A1A2E] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00B894]/30 focus:border-[#00B894]"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                selectedCategory === cat.key
                  ? 'bg-[#00B894] text-white'
                  : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#00B894]/30',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Furniture grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((item, i) => {
            const isPlaced = placed.includes(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={clsx(
                  'bg-white rounded-2xl border p-4 flex flex-col items-center gap-2 transition-all',
                  isPlaced ? 'border-[#00B894] bg-[#F0FFF4]' : 'border-[#E5E7EB]',
                )}
              >
                <span className="text-3xl">{item.icon}</span>
                <p className="text-xs font-bold text-[#1A1A2E] text-center leading-tight">{item.name}</p>
                <p className="text-[11px] text-[#9CA3AF]">{item.brand}</p>
                <p className="text-sm font-bold text-[#00B894]">{'\u20AC'}{item.price.toFixed(2)}</p>
                <button
                  onClick={() => togglePlace(item.id)}
                  className={clsx(
                    'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all w-full justify-center',
                    isPlaced
                      ? 'bg-[#00B894] text-white'
                      : 'bg-[#00B894]/10 text-[#00B894] hover:bg-[#00B894]/20',
                  )}
                >
                  <Plus size={12} className={isPlaced ? 'rotate-45' : ''} />
                  {isPlaced ? 'Geplaatst' : 'Plaatsen'}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Placed count */}
        {placed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-[#9CA3AF]">{placed.length} meubels geplaatst</p>
              <p className="text-base font-bold text-[#1A1A2E]">
                Totaal: {'\u20AC'}
                {FURNITURE_ITEMS.filter((f) => placed.includes(f.id))
                  .reduce((sum, f) => sum + f.price, 0)
                  .toFixed(2)}
              </p>
            </div>
            <Link
              href="/mijn-ruimte/model?room=1"
              className="px-4 py-2.5 rounded-xl text-white text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #00B894, #55E6C1)' }}
            >
              Bekijk in 3D
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
