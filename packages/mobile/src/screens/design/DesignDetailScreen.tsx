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

export const DesignDetailScreen = ({ route }: any) => {
  const style = route?.params?.style || 'japandi';

  const budget = [
    { category: 'Verf & afwerking', amount: 185 },
    { category: 'Meubels', amount: 977 },
    { category: 'Verlichting', amount: 210 },
    { category: 'Accessoires', amount: 165 },
    { category: 'Textiel', amount: 120 },
  ];
  const totalBudget = budget.reduce((sum, b) => sum + b.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ontwerpdetails</Text>
        <Text style={styles.subtitle}>
          Volledig overzicht van je {style} ontwerp
        </Text>

        {/* Moodboard placeholder */}
        <View style={styles.moodboard}>
          <Text style={styles.moodboardIcon}>🖼️</Text>
          <Text style={styles.moodboardText}>Moodboard</Text>
          <Text style={styles.moodboardHint}>
            AI-gegenereerd stijlbord wordt hier getoond
          </Text>
        </View>

        {/* Color scheme */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎨 Kleurenschema</Text>
          {[
            { name: 'Muren', hex: '#F5F0E8', label: 'Warm Wit - Flexa' },
            { name: 'Accent muur', hex: '#A67B5B', label: 'Brave Ground - Flexa' },
            { name: 'Plafond', hex: '#FFFFFF', label: 'Stralend Wit' },
            { name: 'Houtwerk', hex: '#F2EDE3', label: 'Gebroken Wit - Flexa' },
          ].map((c, i) => (
            <View key={i} style={styles.colorRow}>
              <View style={[styles.colorDot, { backgroundColor: c.hex }]} />
              <View style={styles.colorInfo}>
                <Text style={styles.colorName}>{c.name}</Text>
                <Text style={styles.colorLabel}>{c.label}</Text>
              </View>
              <Text style={styles.colorHex}>{c.hex}</Text>
            </View>
          ))}
        </View>

        {/* Budget breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💰 Geschat budget</Text>
          {budget.map((b, i) => (
            <View key={i} style={styles.budgetRow}>
              <Text style={styles.budgetCategory}>{b.category}</Text>
              <Text style={styles.budgetAmount}>€{b.amount}</Text>
            </View>
          ))}
          <View style={styles.budgetTotal}>
            <Text style={styles.budgetTotalLabel}>Totaal</Text>
            <Text style={styles.budgetTotalAmount}>€{totalBudget}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveText}>💾 Opslaan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareText}>📤 Delen</Text>
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
  subtitle: { ...typography.body, color: colors.textSecondary },
  moodboard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  moodboardIcon: { fontSize: 64 },
  moodboardText: { ...typography.h3, color: colors.text },
  moodboardHint: { ...typography.caption, color: colors.textSecondary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorInfo: { flex: 1 },
  colorName: { ...typography.body, color: colors.text, fontWeight: '600' },
  colorLabel: { ...typography.caption, color: colors.textSecondary },
  colorHex: { ...typography.bodySmall, color: colors.textSecondary, fontFamily: 'monospace' },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  budgetCategory: { ...typography.body, color: colors.text },
  budgetAmount: { ...typography.body, color: colors.text, fontWeight: '600' },
  budgetTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 2,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
  },
  budgetTotalLabel: { ...typography.h3, color: colors.text },
  budgetTotalAmount: { ...typography.h2, color: colors.primary },
  actions: { flexDirection: 'row', gap: spacing.md },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  saveText: { ...typography.button, color: colors.textInverse },
  shareButton: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  shareText: { ...typography.button, color: colors.text },
});
