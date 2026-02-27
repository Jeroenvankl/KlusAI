import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

export const DesignResultScreen = ({ route, navigation }: any) => {
  const style = route?.params?.style || 'japandi';

  // Placeholder suggestions - would come from API
  const suggestions = {
    colorPalette: [
      { hex: '#F5F0E8', name: 'Warm Wit', role: 'Basistint' },
      { hex: '#A67B5B', name: 'Aarde', role: 'Accent' },
      { hex: '#8B9E8B', name: 'Salie', role: 'Secundair' },
    ],
    furniture: [
      { item: 'Zitbank', suggestion: 'Lage bank in lichtgrijs linnen', price: '€599' },
      { item: 'Salontafel', suggestion: 'Ronde eiken tafel met dunne poten', price: '€249' },
      { item: 'Vloerkleed', suggestion: 'Jute kleed in naturel tinten', price: '€129' },
    ],
    accessories: [
      'Keramische vaas in aardetinten',
      'Linnen kussens in neutrale kleuren',
      'Bamboe plantenpot',
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ontwerpresultaat</Text>
        <View style={styles.styleBadge}>
          <Text style={styles.styleBadgeText}>
            Stijl: {style.charAt(0).toUpperCase() + style.slice(1)}
          </Text>
        </View>

        {/* Color Palette */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎨 Kleurenpalet</Text>
          <View style={styles.paletteRow}>
            {suggestions.colorPalette.map((c, i) => (
              <View key={i} style={styles.paletteItem}>
                <View style={[styles.paletteCircle, { backgroundColor: c.hex }]} />
                <Text style={styles.paletteName}>{c.name}</Text>
                <Text style={styles.paletteRole}>{c.role}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Furniture suggestions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛋️ Meubelsuggesties</Text>
          {suggestions.furniture.map((f, i) => (
            <View key={i} style={styles.furnitureItem}>
              <View style={styles.furnitureInfo}>
                <Text style={styles.furnitureLabel}>{f.item}</Text>
                <Text style={styles.furnitureDesc}>{f.suggestion}</Text>
              </View>
              <Text style={styles.furniturePrice}>{f.price}</Text>
            </View>
          ))}
        </View>

        {/* Accessories */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🪴 Accessoires</Text>
          {suggestions.accessories.map((a, i) => (
            <View key={i} style={styles.accessoryRow}>
              <Text style={styles.accessoryBullet}>•</Text>
              <Text style={styles.accessoryText}>{a}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => navigation.navigate('DesignDetail', { style })}
        >
          <Text style={styles.detailButtonText}>📋 Bekijk volledig plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  title: { ...typography.h2, color: colors.text },
  styleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  styleBadgeText: { ...typography.bodySmall, color: colors.textInverse, fontWeight: '600' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  cardTitle: { ...typography.h3, color: colors.text },
  paletteRow: { flexDirection: 'row', justifyContent: 'space-around' },
  paletteItem: { alignItems: 'center', gap: spacing.xs },
  paletteCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paletteName: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  paletteRole: { ...typography.caption, color: colors.textSecondary },
  furnitureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  furnitureInfo: { flex: 1, gap: 2 },
  furnitureLabel: { ...typography.body, color: colors.text, fontWeight: '600' },
  furnitureDesc: { ...typography.caption, color: colors.textSecondary },
  furniturePrice: { ...typography.body, color: colors.primary, fontWeight: '700' },
  accessoryRow: { flexDirection: 'row', gap: spacing.sm },
  accessoryBullet: { ...typography.body, color: colors.primary },
  accessoryText: { ...typography.body, color: colors.text, flex: 1 },
  detailButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  detailButtonText: { ...typography.button, color: colors.textInverse },
});
