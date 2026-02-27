'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-6xl mb-4"
      >
        {'\uD83D\uDD27'}
      </motion.div>
      <h1 className="text-xl font-bold text-[#1A1A2E] mb-2">Pagina niet gevonden</h1>
      <p className="text-sm text-[#6B7280] mb-6 max-w-sm">
        De pagina die je zoekt bestaat niet of is verplaatst.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#4A90D9] hover:bg-[#357ABD] transition-colors"
        >
          <Home size={16} />
          Dashboard
        </Link>
      </div>
    </div>
  );
}
