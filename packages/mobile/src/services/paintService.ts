import { api, uploadImage } from './api';

export const paintService = {
  segmentAuto: (imageUri: string) =>
    uploadImage('/segment/auto', imageUri),

  segmentPoint: (imageBase64: string, pointX: number, pointY: number) =>
    api.post('/segment/point', { image_base64: imageBase64, point_x: pointX, point_y: pointY }),

  applyPaint: (imageBase64: string, maskId: number, colorHex: string, brightness: number, warmth: number) =>
    api.post('/paint/apply', {
      image_base64: imageBase64,
      mask_id: maskId,
      color_hex: colorHex,
      brightness,
      warmth,
    }),

  searchColors: (hexCode: string, limit?: number, brand?: string) =>
    api.post('/paint/search-colors', { hex_code: hexCode, limit: limit || 10, brand }),

  getBrands: () =>
    api.get('/paint/brands'),
};
