'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';

interface ImageUploadProps {
  onImageSelect: (file: File, dataUrl: string) => void;
  preview?: string | null;
  onClear?: () => void;
  aspectRatio?: string;
  className?: string;
}

export default function ImageUpload({
  onImageSelect,
  preview,
  onClear,
  aspectRatio = '4/3',
  className,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(file, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  if (preview) {
    return (
      <div className={clsx('relative rounded-2xl overflow-hidden bg-black', className)} style={{ aspectRatio }}>
        <img src={preview} alt="Preview" className="w-full h-full object-contain" />
        {onClear && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={onClear}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X size={16} />
          </motion.button>
        )}
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={clsx(
        'relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer',
        isDragging
          ? 'border-[#4A90D9] bg-[#4A90D9]/5 scale-[1.01]'
          : 'border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#4A90D9]/50 hover:bg-[#4A90D9]/[0.02]',
        className,
      )}
      style={{ aspectRatio }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={isDragging ? 'drag' : 'idle'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4"
        >
          {isDragging ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-[#4A90D9]/10 flex items-center justify-center">
                <ImageIcon size={28} className="text-[#4A90D9]" />
              </div>
              <p className="text-sm font-medium text-[#4A90D9]">Laat los om te uploaden</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center">
                <Upload size={24} className="text-[#9CA3AF]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#1A1A2E]">
                  Sleep een foto hierheen
                </p>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  of klik om een bestand te kiezen
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4A90D9] text-white text-xs font-medium hover:bg-[#357ABD] transition-colors"
                >
                  <Camera size={14} />
                  Foto maken
                </button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
