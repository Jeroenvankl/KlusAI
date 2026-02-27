'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import ImageUpload from '@/components/paint/ImageUpload';
import { ScanLine, ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import clsx from 'clsx';

const SCAN_STEPS = [
  { title: 'Overzichtsfoto', hint: 'Maak een foto van de hele ruimte' },
  { title: 'Linkermuur', hint: 'Richt de camera op de linkermuur' },
  { title: 'Rechtermuur', hint: 'Richt de camera op de rechtermuur' },
  { title: 'Details', hint: 'Neem belangrijke details op (ramen, deuren)' },
];

export default function ScanPage() {
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleImageSelect = useCallback(
    (_file: File, dataUrl: string) => {
      setPhotos((prev) => {
        const next = [...prev];
        next[step] = dataUrl;
        return next;
      });
    },
    [step],
  );

  const handleClear = useCallback(() => {
    setPhotos((prev) => {
      const next = [...prev];
      next[step] = null;
      return next;
    });
  }, [step]);

  const handleFinish = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
    }, 2500);
  };

  const progress = ((step + 1) / SCAN_STEPS.length) * 100;
  const capturedCount = photos.filter(Boolean).length;

  if (isDone) {
    return (
      <div>
        <PageHeader
          title="Scan voltooid!"
          subtitle="Je ruimte is succesvol gescand"
          icon={ScanLine}
          gradient={['#00B894', '#55E6C1']}
        />
        <div className="px-4 md:px-8 pb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-12"
          >
            <div className="w-20 h-20 rounded-full bg-[#D5F5E3] flex items-center justify-center">
              <Check size={36} className="text-[#00B894]" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#1A1A2E]">{capturedCount} foto&apos;s verwerkt</p>
              <p className="text-sm text-[#6B7280] mt-1">Je ruimtemodel wordt gegenereerd</p>
            </div>
            <div className="flex gap-3 mt-4">
              <Link
                href="/mijn-ruimte/model?room=new"
                className="px-5 py-2.5 rounded-xl text-white text-sm font-medium"
                style={{ background: 'linear-gradient(135deg, #00B894, #55E6C1)' }}
              >
                Bekijk model
              </Link>
              <Link
                href="/mijn-ruimte"
                className="px-5 py-2.5 rounded-xl text-sm font-medium border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
              >
                Terug
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div>
        <PageHeader
          title="Verwerken..."
          subtitle="Even geduld"
          icon={ScanLine}
          gradient={['#00B894', '#55E6C1']}
        />
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <ScanLine size={40} className="text-[#00B894]" />
          </motion.div>
          <p className="text-sm font-bold text-[#1A1A2E]">Ruimte wordt geanalyseerd...</p>
          <p className="text-xs text-[#6B7280] text-center max-w-xs px-4">
            AI detecteert muren, ramen, deuren en berekent afmetingen
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Ruimte scannen"
        subtitle={`Stap ${step + 1} van ${SCAN_STEPS.length}`}
        icon={ScanLine}
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

        {/* Progress bar */}
        <div className="bg-[#F3F4F6] rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #00B894, #55E6C1)' }}
          />
        </div>

        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-2">
          {SCAN_STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                i === step
                  ? 'bg-[#00B894] text-white scale-110'
                  : photos[i]
                    ? 'bg-[#D5F5E3] text-[#00B894]'
                    : 'bg-[#F3F4F6] text-[#9CA3AF]',
              )}
            >
              {photos[i] ? <Check size={14} /> : i + 1}
            </button>
          ))}
        </div>

        {/* Current step info */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center"
        >
          <h3 className="text-base font-bold text-[#1A1A2E]">{SCAN_STEPS[step].title}</h3>
          <p className="text-sm text-[#6B7280] mt-0.5">{SCAN_STEPS[step].hint}</p>
        </motion.div>

        {/* Camera / upload area */}
        <motion.div key={`upload-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ImageUpload
            onImageSelect={handleImageSelect}
            preview={photos[step]}
            onClear={handleClear}
            aspectRatio="4/3"
          />
        </motion.div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium border border-[#E5E7EB] transition-all',
              step === 0
                ? 'opacity-40 cursor-not-allowed text-[#9CA3AF]'
                : 'text-[#1A1A2E] hover:bg-[#F3F4F6]',
            )}
          >
            <ChevronLeft size={16} />
            Vorige
          </button>

          {step < SCAN_STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium text-white active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, #00B894, #55E6C1)' }}
            >
              Volgende
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={capturedCount === 0}
              className={clsx(
                'flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium text-white active:scale-[0.98] transition-transform',
                capturedCount === 0 ? 'opacity-50 cursor-not-allowed' : '',
              )}
              style={{ background: 'linear-gradient(135deg, #00B894, #55E6C1)' }}
            >
              <Check size={16} />
              Voltooien
            </button>
          )}
        </div>

        {/* Photo count */}
        <p className="text-xs text-center text-[#9CA3AF]">
          {capturedCount} van {SCAN_STEPS.length} foto&apos;s gemaakt
        </p>
      </div>
    </div>
  );
}
