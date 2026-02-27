import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SliderControl } from '../../components/ui/SliderControl';
import { usePaintStore } from '../../store/paintStore';
import { colors, typography, spacing, borderRadius } from '../../theme';

export const PaintPreviewScreen = ({ navigation }: any) => {
  const {
    selectedColorHex,
    brightness,
    warmth,
    previewImage,
    setBrightness,
    setWarmth,
  } = usePaintStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Verfvoorbeeld</Text>

        {/* Preview area */}
        <View style={styles.previewContainer}>
          {previewImage ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${previewImage}` }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Text style={styles.placeholderIcon}>🖼️</Text>
              <Text style={styles.placeholderText}>
                Maak eerst een foto van je muur
              </Text>
              <TouchableOpacity style={styles.photoButton}>
                <Text style={styles.photoButtonText}>📸 Foto maken</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Selected color indicator */}
        {selectedColorHex && (
          <View style={styles.colorIndicator}>
            <View style={[styles.colorDot, { backgroundColor: selectedColorHex }]} />
            <Text style={styles.colorLabel}>
              Geselecteerde kleur: {selectedColorHex}
            </Text>
          </View>
        )}

        {/* Light controls */}
        <View style={styles.controlsCard}>
          <Text style={styles.controlsTitle}>Lichtinstellingen</Text>
          <SliderControl
            label="Helderheid"
            value={brightness}
            min={0}
            max={100}
            onValueChange={setBrightness}
            leftLabel="Donker"
            rightLabel="Licht"
          />
          <SliderControl
            label="Warmte"
            value={warmth + 50}
            min={0}
            max={100}
            onValueChange={(v) => setWarmth(v - 50)}
            leftLabel="Koel"
            rightLabel="Warm"
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.compareButton}
            onPress={() => navigation.navigate('PaintCompare')}
          >
            <Text style={styles.compareText}>🔄 Vergelijken</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('PaintCart')}
          >
            <Text style={styles.cartText}>🛒 Winkelwagen</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  title: { ...typography.h2, color: colors.text },
  previewContainer: {
    aspectRatio: 4 / 3,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%' },
  previewPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  placeholderIcon: { fontSize: 64 },
  placeholderText: { ...typography.body, color: colors.textSecondary },
  photoButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  photoButtonText: { ...typography.button, color: colors.textInverse },
  colorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  colorDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  colorLabel: { ...typography.bodySmall, color: colors.textSecondary },
  controlsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  controlsTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.md },
  compareButton: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  compareText: { ...typography.button, color: colors.text },
  cartButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cartText: { ...typography.button, color: colors.textInverse },
});
