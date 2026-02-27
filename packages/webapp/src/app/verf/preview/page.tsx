'use client';

import { Suspense, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import ImageUpload from '@/components/paint/ImageUpload';
import ColorSwatch from '@/components/paint/ColorSwatch';
import SliderControl from '@/components/paint/SliderControl';
import { useCart } from '@/components/paint/PaintCart';
import { applyPaint } from '@/lib/api-client';
import {
  Paintbrush,
  Loader2,
  ShoppingCart,
  RotateCcw,
  ArrowLeft,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import clsx from 'clsx';

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="px-4 pt-6 pb-8 text-center text-[#9CA3AF]">Laden...</div>}>
      <PreviewContent />
    </Suspense>
  );
}

const QUICK_COLORS = [
  // Wit & Neutraal
  { hex: '#F5F0E8', name: 'Warm Wit' },
  { hex: '#F2EDE3', name: 'Gebroken Wit' },
  // Blauw & Grijs
  { hex: '#B0C4D8', name: 'Denim Drift' },
  { hex: '#8B8E8F', name: 'Industrial Grey' },
  // Groen
  { hex: '#9CA88C', name: 'Saliegroen' },
  { hex: '#4A6E5B', name: 'Northern Roots' },
  { hex: '#B8E8D0', name: 'Mintgroen' },
  // Aarde
  { hex: '#A67B5B', name: 'Brave Ground' },
  { hex: '#C89E8E', name: 'Mellow Clay' },
  { hex: '#C87850', name: 'Terracotta' },
  // Rood & Roze
  { hex: '#B5575A', name: 'Passionate Red' },
  { hex: '#D8B8B8', name: 'Blush Pink' },
  { hex: '#E8C8D0', name: 'Roze Pastel' },
  // Pastel
  { hex: '#CACDBE', name: 'Tranquil Dawn' },
  { hex: '#D5DFC8', name: 'Lentemist' },
  { hex: '#C8D8D8', name: 'Dauwdruppel' },
];

function PreviewContent() {
  const searchParams = useSearchParams();
  const initialColor = searchParams.get('color') || '#B0C4D8';

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [brightness, setBrightness] = useState(50);
  const [warmth, setWarmth] = useState(0);
  const [previewResult, setPreviewResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [estimates, setEstimates] = useState<{
    area: number | null;
    liters: number | null;
    cost: number | null;
  } | null>(null);
  const { addItem } = useCart();

  const handleImageSelect = useCallback((file: File, dataUrl: string) => {
    setImageFile(file);
    setImageDataUrl(dataUrl);
    setPreviewResult(null);
    setEstimates(null);
    setError(null);
  }, []);

  const handleClearImage = useCallback(() => {
    setImageFile(null);
    setImageDataUrl(null);
    setPreviewResult(null);
    setEstimates(null);
    setError(null);
  }, []);

  const handleApplyPaint = useCallback(async () => {
    if (!imageDataUrl) return;
    setIsLoading(true);
    setError(null);

    try {
      const base64 = imageDataUrl.split(',')[1];
      const result = await applyPaint({
        image_base64: base64,
        mask_id: 0,
        color_hex: selectedColor,
        brightness,
        warmth,
      });

      setPreviewResult(`data:image/png;base64,${result.preview_image_base64}`);
      setEstimates({
        area: result.estimated_area_m2,
        liters: result.estimated_liters,
        cost: result.estimated_cost,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis bij het verwerken.');
    } finally {
      setIsLoading(false);
    }
  }, [imageDataUrl, selectedColor, brightness, warmth]);

  const handleAddToCart = useCallback(() => {
    const color = QUICK_COLORS.find((c) => c.hex === selectedColor);
    addItem({
      id: selectedColor,
      name: color?.name || selectedColor,
      brand: 'Onbekend',
      hex: selectedColor,
      price: estimates?.cost || null,
      finish: null,
    });
  }, [selectedColor, estimates, addItem]);

  return (
    <div>
      <PageHeader
        title="Kleur Preview"
        subtitle="Upload een foto en bekijk kleuren op je muur"
        icon={Paintbrush}
        gradient={['#FF6B6B', '#EE5A24']}
      />

      <div className="px-4 md:px-8 space-y-4 pb-8">
        {/* Back link */}
        <Link
          href="/verf"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A1A2E] transition-colors"
        >
          <ArrowLeft size={16} />
          Terug naar kleuren
        </Link>

        {/* Image upload / preview area */}
        <div className="relative">
          <ImageUpload
            onImageSelect={handleImageSelect}
            preview={previewResult || imageDataUrl}
            onClear={handleClearImage}
            aspectRatio="4/3"
          />

          {/* Toggle original/preview */}
          {previewResult && imageDataUrl && (
            <button
              onClick={() => setPreviewResult(null)}
              className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs font-medium hover:bg-black/70 transition-colors"
            >
              <Layers size={14} />
              Origineel tonen
            </button>
          )}
        </div>

        {/* Color selection */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#1A1A2E]">Kleur kiezen</h3>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg shadow-sm border border-[#E5E7EB]"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="text-xs font-mono text-[#6B7280]">{selectedColor}</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {QUICK_COLORS.map((color) => (
              <ColorSwatch
                key={color.hex}
                hex={color.hex}
                name={color.name}
                size="sm"
                selected={selectedColor === color.hex}
                onClick={() => setSelectedColor(color.hex)}
              />
            ))}
            <div className="flex flex-col items-center gap-1.5">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="text-[11px] text-[#9CA3AF]">Eigen</span>
            </div>
          </div>
        </div>

        {/* Brightness & Warmth controls */}
        {imageDataUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden"
          >
            <button
              onClick={() => setShowControls(!showControls)}
              className="w-full flex items-center justify-between p-4"
            >
              <span className="text-sm font-bold text-[#1A1A2E]">Instellingen</span>
              {showControls ? (
                <ChevronUp size={16} className="text-[#9CA3AF]" />
              ) : (
                <ChevronDown size={16} className="text-[#9CA3AF]" />
              )}
            </button>
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4">
                    <SliderControl
                      label="Helderheid"
                      value={brightness}
                      min={0}
                      max={100}
                      unit="%"
                      onChange={setBrightness}
                      gradient="linear-gradient(90deg, #1A1A2E, #FFF)"
                    />
                    <SliderControl
                      label="Warmte"
                      value={warmth}
                      min={-50}
                      max={50}
                      onChange={setWarmth}
                      gradient="linear-gradient(90deg, #74B9FF, #FF6B6B)"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* Estimates */}
        {estimates && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 border border-[#E5E7EB]"
          >
            <h3 className="text-sm font-bold text-[#1A1A2E] mb-3">Schatting</h3>
            <div className="grid grid-cols-3 gap-3">
              {estimates.area != null && (
                <div className="text-center">
                  <p className="text-lg font-bold text-[#FF6B6B]">
                    {estimates.area.toFixed(1)}
                  </p>
                  <p className="text-[11px] text-[#9CA3AF]">m²</p>
                </div>
              )}
              {estimates.liters != null && (
                <div className="text-center">
                  <p className="text-lg font-bold text-[#FF6B6B]">
                    {estimates.liters.toFixed(1)}
                  </p>
                  <p className="text-[11px] text-[#9CA3AF]">liter nodig</p>
                </div>
              )}
              {estimates.cost != null && (
                <div className="text-center">
                  <p className="text-lg font-bold text-[#FF6B6B]">
                    €{estimates.cost.toFixed(0)}
                  </p>
                  <p className="text-[11px] text-[#9CA3AF]">geschatte kosten</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        {imageDataUrl && (
          <div className="flex gap-2">
            <button
              onClick={handleApplyPaint}
              disabled={isLoading}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                isLoading
                  ? 'bg-[#FF6B6B]/50 text-white cursor-wait'
                  : 'bg-[#FF6B6B] text-white hover:bg-[#EE5A24] active:scale-[0.98]',
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verwerken...
                </>
              ) : previewResult ? (
                <>
                  <RotateCcw size={18} />
                  Opnieuw toepassen
                </>
              ) : (
                <>
                  <Paintbrush size={18} />
                  Kleur toepassen
                </>
              )}
            </button>

            {previewResult && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-[#1A1A2E] text-white hover:bg-[#2D2D44] transition-colors"
              >
                <ShoppingCart size={18} />
                Bewaar
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
