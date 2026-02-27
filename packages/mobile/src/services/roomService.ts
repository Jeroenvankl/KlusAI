import { uploadImage } from './api';

export const roomService = {
  analyzeRoom: (imageUri: string) =>
    uploadImage('/analyze-room/', imageUri),
};
