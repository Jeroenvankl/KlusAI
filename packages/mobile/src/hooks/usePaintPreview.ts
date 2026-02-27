import { useCallback, useState } from 'react';
import { usePaintStore } from '../store/paintStore';
import * as paintService from '../services/paintService';
import { uploadImage } from '../services/api';

export const usePaintPreview = () => {
  const store = usePaintStore();
  const [error, setError] = useState<string | null>(null);

  const segmentImage = useCallback(
    async (imageUri: string) => {
      try {
        store.setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'room.jpg',
        } as any);

        const result = await paintService.segmentAuto(formData);
        store.setMasks(result.segments);
        return result;
      } catch (err: any) {
        setError(err.message || 'Segmentatie mislukt');
        throw err;
      } finally {
        store.setLoading(false);
      }
    },
    [store],
  );

  const applyPaint = useCallback(
    async (imageUri: string, maskId: string, colorHex: string) => {
      try {
        store.setLoading(true);
        setError(null);

        const result = await paintService.applyPaint({
          image_base64: imageUri, // Would convert to base64 in production
          mask_id: maskId,
          color_hex: colorHex,
          brightness: store.brightness,
          warmth: store.warmth,
        });

        store.setPreviewImage(result.preview_image);
        return result;
      } catch (err: any) {
        setError(err.message || 'Verf toepassen mislukt');
        throw err;
      } finally {
        store.setLoading(false);
      }
    },
    [store],
  );

  const searchColors = useCallback(
    async (query: string) => {
      try {
        const result = await paintService.searchColors({
          query,
          limit: 20,
        });
        return result;
      } catch (err: any) {
        setError(err.message || 'Kleuren zoeken mislukt');
        return [];
      }
    },
    [],
  );

  return {
    ...store,
    error,
    segmentImage,
    applyPaint,
    searchColors,
  };
};
