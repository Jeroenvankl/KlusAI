import { create } from 'zustand';

interface PaintState {
  selectedColorHex: string | null;
  brightness: number;
  warmth: number;
  previewImage: string | null;
  masks: any[];
  selectedMaskId: number | null;
  isLoading: boolean;
  setSelectedColor: (hex: string) => void;
  setBrightness: (val: number) => void;
  setWarmth: (val: number) => void;
  setPreviewImage: (img: string | null) => void;
  setMasks: (masks: any[]) => void;
  setSelectedMask: (id: number) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const usePaintStore = create<PaintState>((set) => ({
  selectedColorHex: null,
  brightness: 50,
  warmth: 0,
  previewImage: null,
  masks: [],
  selectedMaskId: null,
  isLoading: false,
  setSelectedColor: (hex) => set({ selectedColorHex: hex }),
  setBrightness: (val) => set({ brightness: val }),
  setWarmth: (val) => set({ warmth: val }),
  setPreviewImage: (img) => set({ previewImage: img }),
  setMasks: (masks) => set({ masks }),
  setSelectedMask: (id) => set({ selectedMaskId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  reset: () => set({
    selectedColorHex: null, brightness: 50, warmth: 0,
    previewImage: null, masks: [], selectedMaskId: null, isLoading: false,
  }),
}));
