import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface ImagePickerProps {
  onCamera: () => void;
  onGallery: () => void;
  isLoading?: boolean;
  title?: string;
  hint?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  onCamera,
  onGallery,
  isLoading = false,
  title = 'Foto toevoegen',
  hint = 'Maak een foto of kies uit je galerij',
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Verwerken...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📸</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.hint}>{hint}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cameraButton} onPress={onCamera}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.galleryButton} onPress={onGallery}>
          <Text style={styles.galleryIcon}>🖼️</Text>
          <Text style={styles.buttonText}>Galerij</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    gap: spacing.sm,
  },
  icon: { fontSize: 48 },
  title: { ...typography.button, color: colors.text },
  hint: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  loadingText: { ...typography.body, color: colors.textSecondary },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  cameraButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  galleryButton: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cameraIcon: { fontSize: 18 },
  galleryIcon: { fontSize: 18 },
  buttonText: { ...typography.bodySmall, fontWeight: '600' },
});
