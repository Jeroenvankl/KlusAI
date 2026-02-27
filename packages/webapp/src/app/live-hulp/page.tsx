'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Video, ArrowLeft, Camera, MessageSquare, Wifi, WifiOff } from 'lucide-react';

export default function LiveHulpPage() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="min-h-dvh bg-[#1A1A2E] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/30">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Terug
        </Link>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Wifi size={16} className="text-[#00B894]" />
          ) : (
            <WifiOff size={16} className="text-[#EF4444]" />
          )}
          <span className="text-xs text-white/60">
            {isConnected ? 'Verbonden' : 'Niet verbonden'}
          </span>
        </div>
      </div>

      {/* Camera view placeholder */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #E67E22, #F39C12)' }}
        >
          <Video size={40} className="text-white" />
        </motion.div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">Live Hulp</h1>
          <p className="text-sm text-white/60 mt-1 max-w-xs">
            Richt je camera op je klusproject en krijg realtime AI-hulp
          </p>
        </div>

        {!isConnected && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setIsConnected(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium active:scale-[0.98] transition-transform mt-4"
            style={{ background: 'linear-gradient(135deg, #E67E22, #F39C12)' }}
          >
            <Camera size={18} />
            Start camera
          </motion.button>
        )}

        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm space-y-3 mt-4"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-xs text-white/40 mb-1">AI Assistent</p>
              <p className="text-sm text-white">
                Camera is actief. Richt op je klusproject en stel een vraag.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Stel een vraag..."
                className="flex-1 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#E67E22]/50 border border-white/10"
              />
              <button
                className="px-4 py-2.5 rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #E67E22, #F39C12)' }}
              >
                <MessageSquare size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom controls */}
      {isConnected && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-4 py-4 bg-black/30"
        >
          <button
            onClick={() => setIsConnected(false)}
            className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-[#EF4444] text-white active:scale-[0.98] transition-transform"
          >
            Stop sessie
          </button>
        </motion.div>
      )}
    </div>
  );
}
