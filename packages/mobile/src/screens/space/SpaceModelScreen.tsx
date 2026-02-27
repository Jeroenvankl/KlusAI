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

export const SpaceModelScreen = ({ route, navigation }: any) => {
  const roomId = route?.params?.roomId;

  const dimensions = {
    length: 5.2,
    width: 3.8,
    height: 2.7,
    area: 19.76,
    volume: 53.35,
  };

  const segments = [
    { type: 'Muur', count: 4, area: '48.6 m²', color: '#F5F0E8' },
    { type: 'Raam', count: 2, area: '3.2 m²', color: '#B8D4E8' },
    { type: 'Deur', count: 1, area: '1.8 m²', color: '#C4A882' },
    { type: 'Vloer', count: 1, area: '19.8 m²', color: '#D4C4A8' },
    { type: 'Plafond', count: 1, area: '19.8 m²', color: '#FFFFFF' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ruimtemodel</Text>

        {/* 3D placeholder */}
        <View style={styles.modelView}>
          <Text style={styles.modelIcon}>🧱</Text>
          <Text style={styles.modelText}>3D-weergave</Text>
          <Text style={styles.modelHint}>
            Interactief model wordt hier getoond
          </Text>
        </View>

        {/* Dimensions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📏 Afmetingen</Text>
          <View style={styles.dimGrid}>
            <View style={styles.dimItem}>
              <Text style={styles.dimValue}>{dimensions.length}m</Text>
              <Text style={styles.dimLabel}>Lengte</Text>
            </View>
            <View style={styles.dimItem}>
              <Text style={styles.dimValue}>{dimensions.width}m</Text>
              <Text style={styles.dimLabel}>Breedte</Text>
            </View>
            <View style={styles.dimItem}>
              <Text style={styles.dimValue}>{dimensions.height}m</Text>
              <Text style={styles.dimLabel}>Hoogte</Text>
            </View>
            <View style={styles.dimItem}>
              <Text style={styles.dimValue}>{dimensions.area} m²</Text>
              <Text style={styles.dimLabel}>Oppervlakte</Text>
            </View>
          </View>
        </View>

        {/* Segments */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏗️ Elementen</Text>
          {segments.map((s, i) => (
            <View key={i} style={styles.segmentRow}>
              <View style={[styles.segmentColor, { backgroundColor: s.color }]} />
              <Text style={styles.segmentType}>{s.type}</Text>
              <Text style={styles.segmentCount}>×{s.count}</Text>
              <Text style={styles.segmentArea}>{s.area}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.furnitureButton}
            onPress={() => navigation.navigate('SpaceFurniture', { roomId })}
          >
            <Text style={styles.furnitureButtonText}>🪑 Meubels plaatsen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.exportText}>📤 Exporteren</Text>
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
  modelView: {
    aspectRatio: 4 / 3,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  modelIcon: { fontSize: 64 },
  modelText: { ...typography.h3, color: colors.text },
  modelHint: { ...typography.caption, color: colors.textSecondary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  dimGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  dimItem: {
    width: '45%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    alignItems: 'center',
  },
  dimValue: { ...typography.h3, color: colors.primary },
  dimLabel: { ...typography.caption, color: colors.textSecondary },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  segmentColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmentType: { ...typography.body, color: colors.text, flex: 1 },
  segmentCount: { ...typography.bodySmall, color: colors.textSecondary },
  segmentArea: { ...typography.body, color: colors.text, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: spacing.md },
  furnitureButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  furnitureButtonText: { ...typography.button, color: colors.textInverse },
  exportButton: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  exportText: { ...typography.button, color: colors.text },
});
