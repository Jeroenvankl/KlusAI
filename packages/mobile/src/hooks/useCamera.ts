import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface UseCameraOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export const useCamera = (options: UseCameraOptions = {}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { quality = 0.8 } = options;

  const takePhoto = useCallback(async () => {
    setIsLoading(true);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Geen toegang', 'Camera-toegang is nodig om een foto te maken');
        setIsLoading(false);
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Fout', 'Er ging iets mis bij het maken van de foto');
    } finally {
      setIsLoading(false);
    }
  }, [quality]);

  const pickFromGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Geen toegang', 'Galerij-toegang is nodig om een foto te kiezen');
        setIsLoading(false);
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Fout', 'Er ging iets mis bij het kiezen van de foto');
    } finally {
      setIsLoading(false);
    }
  }, [quality]);

  const showPicker = useCallback(() => {
    if (Platform.OS === 'web') {
      pickFromGallery();
      return;
    }
    Alert.alert('Foto kiezen', 'Hoe wil je een foto toevoegen?', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Galerij', onPress: pickFromGallery },
      { text: 'Annuleer', style: 'cancel' },
    ]);
  }, [takePhoto, pickFromGallery]);

  const reset = useCallback(() => {
    setImageUri(null);
  }, []);

  return {
    imageUri,
    isLoading,
    takePhoto,
    pickFromGallery,
    showPicker,
    reset,
  };
};
