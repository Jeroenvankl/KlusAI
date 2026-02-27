/**
 * Image utility functions for the mobile app
 */
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

/**
 * Get a FormData object for uploading an image to the API
 */
export const createImageFormData = (
  uri: string,
  fieldName = 'image',
): FormData => {
  const formData = new FormData();

  // Determine file extension and mime type
  const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
  const mimeType =
    extension === 'png' ? 'image/png' : extension === 'gif' ? 'image/gif' : 'image/jpeg';

  formData.append(fieldName, {
    uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
    type: mimeType,
    name: `upload.${extension}`,
  } as any);

  return formData;
};

/**
 * Convert a local image URI to a base64 data string
 * Uses expo-file-system
 */
export const imageUriToBase64 = async (uri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch {
    throw new Error('Kan afbeelding niet lezen');
  }
};

/**
 * Get a safe image URI for display (handles platform differences)
 */
export const getSafeImageUri = (uri: string): string => {
  if (Platform.OS === 'android') {
    return uri;
  }
  // iOS sometimes needs file:// prefix
  if (!uri.startsWith('file://') && !uri.startsWith('http')) {
    return `file://${uri}`;
  }
  return uri;
};

/**
 * Calculate image dimensions to fit within a container while maintaining aspect ratio
 */
export const fitImageDimensions = (
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
): { width: number; height: number } => {
  const widthRatio = containerWidth / imageWidth;
  const heightRatio = containerHeight / imageHeight;
  const ratio = Math.min(widthRatio, heightRatio);

  return {
    width: imageWidth * ratio,
    height: imageHeight * ratio,
  };
};
