import axios from 'axios';
import { Platform } from 'react-native';

// Use LAN IP so physical devices can reach the backend
// Change this to your Mac's IP if it changes
const API_HOST = '192.168.1.193';

const BASE_URL = Platform.select({
  web: 'http://localhost:8000/api/v1',
  ios: `http://${API_HOST}:8000/api/v1`,
  android: 'http://10.0.2.2:8000/api/v1',
  default: 'http://localhost:8000/api/v1',
}) as string;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const uploadImage = async (
  endpoint: string,
  imageUri: string,
  additionalData?: Record<string, any>,
) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
    });
  }

  return api.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
};
