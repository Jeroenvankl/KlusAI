'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import ImageUpload from '@/components/paint/ImageUpload';
import { Camera, ChevronRight, Link2, ImageIcon, Smartphone } from 'lucide-react';

const EXAMPLES = [
  {
    icon: '\uD83D\uDECB\uFE0F',
    title: 'Woonkamer inspiratie',
    description: 'Ontdek meubels en kleuren uit een Pinterest-foto',
  },
  {
    icon: '\uD83C\uDF73',
    title: 'Keuken design',
    description: 'Vind vergelijkbare keukens bij Nederlandse winkels',
  },
  {
    icon: '\uD83D\uDECF\uFE0F',
    title: 'Slaapkamer stijl',
    description: 'Kopieer de look van een hotelkamer of magazine',
  },
  {
    icon: '\uD83E\uDEB4',
    title: 'Tuin & balkon',
    description: 'Recreëer die perfecte buitenruimte',
  },
];

const SOURCE_BUTTONS = [
  { icon: ImageIcon, label: 'Galerij', source: 'gallery' },
  { icon: Link2, label: 'Pinterest URL', source: 'pinterest' },
  { icon: Smartphone, label: 'Screenshot', source: 'screenshot' },
];

export default function VoorbeeldNadoenPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [pinterestUrl, setPinterestUrl] = useState('');
  const [showPinterest, setShowPinterest] = useState(false);

  const handleImageSelect = (file: File, dataUrl: string) => {
    setImageFile(file);
    setImageDataUrl(dataUrl);
  };

  const handleClear = () => {
    setImageFile(null);
    setImageDataUrl(null);
  };

  return (
    <div>
      <PageHeader
        title="Voorbeeld Nadoen"
        subtitle="Upload een foto en ontdek de producten"
        icon={Camera}
        gradient={['#0984E3', '#74B9FF']}
      />

      <div className="px-4 md:px-8 space-y-6 pb-8">
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[#6B7280]"
        >
          Upload een foto van een interieur dat je mooi vindt en wij vertellen
          je precies hoe je het kunt namaken
        </motion.p>

        {/* Upload area */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <ImageUpload
            onImageSelect={handleImageSelect}
            preview={imageDataUrl}
            onClear={handleClear}
            aspectRatio="4/3"
          />
        </motion.div>

        {/* Pinterest URL input */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] p-4"
        >
          <button
            onClick={() => setShowPinterest(!showPinterest)}
            className="flex items-center gap-2 w-full text-left"
          >
            <Link2 size={18} className="text-[#0984E3]" />
            <span className="text-sm font-bold text-[#1A1A2E]">Of plak een Pinterest URL</span>
          </button>
          {showPinterest && (
            <div className="mt-3 flex gap-2">
              <input
                type="url"
                placeholder="https://pinterest.com/pin/..."
                value={pinterestUrl}
                onChange={(e) => setPinterestUrl(e.target.value)}
                className="flex-1 px-3 py-2.5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] text-sm text-[#1A1A2E] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0984E3]/30 focus:border-[#0984E3]"
              />
              <Link
                href={`/voorbeeld-nadoen/analyse?source=pinterest&url=${encodeURIComponent(pinterestUrl)}`}
                className="px-4 py-2.5 rounded-xl text-white text-sm font-medium flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #0984E3, #74B9FF)' }}
              >
                Analyseer
              </Link>
            </div>
          )}
        </motion.div>

        {/* Analyze button */}
        {imageDataUrl && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Link
              href="/voorbeeld-nadoen/analyse?source=upload"
              className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl text-white text-sm font-medium active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, #0984E3, #74B9FF)' }}
            >
              <Camera size={18} />
              Start AI analyse
            </Link>
          </motion.div>
        )}

        {/* Source buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-3"
        >
          {SOURCE_BUTTONS.map((btn) => {
            const Icon = btn.icon;
            return (
              <Link
                key={btn.source}
                href={`/voorbeeld-nadoen/analyse?source=${btn.source}`}
                className="flex flex-col items-center gap-2 bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-sm hover:border-[#0984E3]/30 transition-all"
              >
                <Icon size={24} className="text-[#0984E3]" />
                <span className="text-xs font-medium text-[#1A1A2E]">{btn.label}</span>
              </Link>
            );
          })}
        </motion.div>

        {/* Examples */}
        <div>
          <h2 className="text-base font-bold text-[#1A1A2E] mb-3">Voorbeelden</h2>
          <div className="space-y-2">
            {EXAMPLES.map((example, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <Link href="/voorbeeld-nadoen/analyse?source=example">
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex items-center gap-3 hover:shadow-sm transition-shadow group">
                    <span className="text-2xl">{example.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-[#1A1A2E] block">{example.title}</span>
                      <span className="text-xs text-[#6B7280] block mt-0.5">{example.description}</span>
                    </div>
                    <ChevronRight size={16} className="text-[#9CA3AF] group-hover:text-[#0984E3] transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
