import { useCallback, useState } from 'react';
import * as roomService from '../services/roomService';

interface RoomAnalysis {
  room_type: string;
  dimensions: { length: number; width: number; height: number };
  walls: any[];
  windows: any[];
  doors: any[];
  furniture: any[];
  lighting: any;
  style_analysis: string;
}

export const useRoomAnalysis = () => {
  const [analysis, setAnalysis] = useState<RoomAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeRoom = useCallback(async (imageUri: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'room.jpg',
      } as any);

      const result = await roomService.analyzeRoom(formData);
      setAnalysis(result);
      return result;
    } catch (err: any) {
      const message = err.message || 'Ruimte-analyse mislukt';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analysis,
    isLoading,
    error,
    analyzeRoom,
    reset,
  };
};
