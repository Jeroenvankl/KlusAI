export interface PaintColor {
  id: number;
  brand: string;
  collection: string | null;
  name: string;
  hexCode: string;
  labL: number;
  labA: number;
  labB: number;
  pricePerLiter: number | null;
  coverageM2: number | null;
  ecoScore: string | null;
  productUrl: string | null;
  imageUrl: string | null;
  finish: string | null;
}

export interface PaintRequest {
  imageBase64: string;
  maskId: number;
  colorHex: string;
  brightness: number; // 0-100, 50 = neutral
  warmth: number; // -50 to +50, 0 = neutral
}

export interface PaintResponse {
  previewImageBase64: string;
  appliedColor: PaintColor;
  estimatedCoverage: number; // m²
  estimatedLiters: number;
  estimatedCost: number;
}

export interface SegmentMask {
  id: number;
  polygon: number[][]; // [[x,y], [x,y], ...]
  area: number;
  label: string;
  segmentType: 'wall' | 'floor' | 'ceiling' | 'window' | 'door' | 'furniture' | 'unknown';
}

export interface SegmentResponse {
  masks: SegmentMask[];
  imageWidth: number;
  imageHeight: number;
}
