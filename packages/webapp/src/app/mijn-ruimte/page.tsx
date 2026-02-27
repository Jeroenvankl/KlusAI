'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { ScanLine, ChevronRight, Plus, X, Armchair } from 'lucide-react';
import clsx from 'clsx';

const INITIAL_ROOMS = [
  { id: '1', name: 'Woonkamer', icon: '\uD83D\uDECB\uFE0F', status: 'scanned' as const },
  { id: '2', name: 'Slaapkamer', icon: '\uD83D\uDECF\uFE0F', status: 'unscanned' as const },
  { id: '3', name: 'Keuken', icon: '\uD83C\uDF73', status: 'unscanned' as const },
];

const ROOM_TEMPLATES = [
  { icon: '\uD83D\uDECB\uFE0F', name: 'Woonkamer' },
  { icon: '\uD83D\uDECF\uFE0F', name: 'Slaapkamer' },
  { icon: '\uD83C\uDF73', name: 'Keuken' },
  { icon: '\uD83D\uDEBF', name: 'Badkamer' },
  { icon: '\uD83D\uDCBC', name: 'Werkkamer' },
  { icon: '\uD83D\uDEAA', name: 'Gang' },
];

export default function MijnRuimtePage() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [showAddModal, setShowAddModal] = useState(false);

  const addRoom = (name: string, icon: string) => {
    setRooms((prev) => [
      ...prev,
      { id: String(Date.now()), name, icon, status: 'unscanned' as const },
    ]);
    setShowAddModal(false);
  };

  return (
    <div>
      <PageHeader
        title="Mijn Ruimte"
        subtitle="Maak een digitaal model van je woning"
        icon={ScanLine}
        gradient={['#00B894', '#55E6C1']}
      />

      <div className="px-4 md:px-8 space-y-6 pb-8">
        {/* Scan button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/mijn-ruimte/scan">
            <div className="bg-white rounded-2xl border-2 border-dashed border-[#00B894]/40 p-6 flex flex-col items-center gap-3 hover:border-[#00B894] hover:shadow-sm transition-all cursor-pointer group">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00B894, #55E6C1)' }}>
                <ScanLine size={28} className="text-white" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-[#1A1A2E]">Nieuwe ruimte scannen</p>
                <p className="text-xs text-[#6B7280] mt-0.5">Maak foto&apos;s vanuit meerdere hoeken</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Room list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#1A1A2E]">Mijn kamers</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 text-xs font-medium text-[#00B894] hover:text-[#00A37D] transition-colors"
            >
              <Plus size={14} />
              Toevoegen
            </button>
          </div>

          <div className="space-y-2">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={room.status === 'scanned' ? `/mijn-ruimte/model?room=${room.id}` : '/mijn-ruimte/scan'}
                >
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex items-center gap-3 hover:shadow-sm transition-shadow group">
                    <span className="text-2xl">{room.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-[#1A1A2E] block">{room.name}</span>
                      <span className={clsx(
                        'text-xs mt-0.5 block',
                        room.status === 'scanned' ? 'text-[#00B894]' : 'text-[#9CA3AF]',
                      )}>
                        {room.status === 'scanned' ? '\u2713 Gescand' : 'Niet gescand'}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-[#9CA3AF] group-hover:text-[#00B894] transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Furniture library link */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/mijn-ruimte/meubels">
            <div className="flex items-center gap-3 bg-[#F0FFF4] rounded-xl p-4 hover:shadow-sm transition-shadow group">
              <Armchair size={22} className="text-[#00B894]" />
              <div className="flex-1">
                <span className="text-sm font-bold text-[#1A1A2E]">Meubelbibliotheek bekijken</span>
                <p className="text-xs text-[#6B7280] mt-0.5">Plaats meubels in je digitale ruimte</p>
              </div>
              <ChevronRight size={16} className="text-[#9CA3AF] group-hover:text-[#00B894] transition-colors" />
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Add room modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#1A1A2E]">Kamer toevoegen</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] hover:bg-[#E5E7EB]"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ROOM_TEMPLATES.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => addRoom(t.name, t.icon)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] hover:border-[#00B894] hover:bg-[#F0FFF4] transition-all text-left"
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <span className="text-sm font-medium text-[#1A1A2E]">{t.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
