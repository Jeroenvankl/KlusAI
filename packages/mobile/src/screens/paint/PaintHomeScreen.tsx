import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ColorSwatch } from '../../components/ui/ColorSwatch';
import { usePaintStore } from '../../store/paintStore';
import { colors, typography, spacing, borderRadius } from '../../theme';

const POPULAR_COLORS = [
  { hex: '#F5F0E8', name: 'Warm Wit', brand: 'Flexa' },
  { hex: '#F2EDE3', name: 'Gebroken Wit', brand: 'Flexa' },
  { hex: '#B0C4D8', name: 'Denim Drift', brand: 'Flexa' },
  { hex: '#CACDBE', name: 'Tranquil Dawn', brand: 'Flexa' },
  { hex: '#8B8E8F', name: 'Industrial Grey', brand: 'Flexa' },
  { hex: '#A67B5B', name: 'Brave Ground', brand: 'Flexa' },
  { hex: '#C8D8D8', name: 'Dauwdruppel', brand: 'Sikkens' },
  { hex: '#D5DFC8', name: 'Lentemist', brand: 'Sikkens' },
  { hex: '#A0B8C8', name: 'Zachtblauw', brand: 'Gamma' },
  { hex: '#9CA88C', name: 'Saliegroen', brand: 'Gamma' },
];

export const PaintHomeScreen = ({ navigation }: any) => {
  const { selectedColorHex, setSelectedColor } = usePaintStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Verf & Kleuren</Text>
        <Text style={styles.subtitle}>
          Maak een foto van je muur en kies een kleur
        </Text>

        {/* Camera/Photo button */}
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => navigation.navigate('PaintPreview')}
        >
          <Text style={styles.cameraIcon}>📸</Text>
          <Text style={styles.cameraText}>Maak een foto van je muur</Text>
          <Text style={styles.cameraHint}>of kies uit je galerij</Text>
        </TouchableOpacity>

        {/* Popular colors */}
        <Text style={styles.sectionTitle}>Populaire kleuren</Text>
        <FlatList
          horizontal
          data={POPULAR_COLORS}
          keyExtractor={(item) => item.hex + item.name}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.colorList}
          renderItem={({ item }) => (
            <ColorSwatch
              hex={item.hex}
              name={item.name}
              brand={item.brand}
              isSelected={selectedColorHex === item.hex}
              onPress={() => setSelectedColor(item.hex)}
              size="medium"
            />
          )}
        />

        {/* Brand filter */}
        <Text style={styles.sectionTitle}>Merken</Text>
        <View style={styles.brandRow}>
          {['Flexa', 'Sikkens', 'Histor', 'Gamma', 'Praxis', 'Karwei'].map((brand) => (
            <TouchableOpacity key={brand} style={styles.brandChip}>
              <Text style={styles.brandText}>{brand}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected color preview */}
        {selectedColorHex && (
          <View style={styles.selectedPreview}>
            <View
              style={[
                styles.selectedSwatch,
                { backgroundColor: selectedColorHex },
              ]}
            />
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedLabel}>Geselecteerde kleur</Text>
              <Text style={styles.selectedHex}>{selectedColorHex}</Text>
            </View>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => navigation.navigate('PaintPreview')}
            >
              <Text style={styles.applyText}>Toepassen</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.lg },
  title: { ...typography.h2, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary },
  cameraButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  cameraIcon: { fontSize: 48, marginBottom: spacing.sm },
  cameraText: { ...typography.button, color: colors.text },
  cameraHint: { ...typography.caption, color: colors.textSecondary },
  sectionTitle: { ...typography.h3, color: colors.text },
  colorList: { gap: spacing.md, paddingVertical: spacing.sm },
  brandRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  brandChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
  },
  brandText: { ...typography.bodySmall, color: colors.text },
  selectedPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  selectedSwatch: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: colors.border },
  selectedInfo: { flex: 1 },
  selectedLabel: { ...typography.bodySmall, color: colors.textSecondary },
  selectedHex: { ...typography.body, color: colors.text, fontWeight: '600' },
  applyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  applyText: { ...typography.button, color: colors.textInverse },
});
