import { uploadImage } from './api';

export const reverseService = {
  analyze: (imageUri: string) =>
    uploadImage('/reverse/analyze', imageUri),
};
