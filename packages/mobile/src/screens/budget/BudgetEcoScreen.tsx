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

const ECO_TIPS = [
  {
    icon: '🎨',
    title: 'Watergedragen verf',
    description: 'Kies verf op waterbasis in plaats van oplosmiddelgebaseerd. Beter voor het milieu én je gezondheid.',
    saving: 'Eco-score: +15%',
    brands: ['Flexa Pure', 'Sikkens Alpha'],
  },
  {
    icon: '♻️',
    title: 'Gerecyclede materialen',
    description: 'Gebruik gerecycled hout en materialen voor een lagere ecologische voetafdruk.',
    saving: 'Besparing: ~20%',
    brands: ['IKEA Kungsbacka', 'Gamma Eco-lijn'],
  },
  {
    icon: '💡',
    title: 'LED-verlichting',
    description: 'Vervang alle gloei- en halogeenlampen door LED. Lager verbruik en langere levensduur.',
    saving: 'Besparing: €80/jaar',
    brands: ['Philips Hue', 'IKEA TRÅDFRI'],
  },
  {
    icon: '🌡️',
    title: 'Isolatie verbeteren',
    description: 'Goede isolatie bespaart op stookkosten en verhoogt je comfortniveau.',
    saving: 'Besparing: €200-400/jaar',
    brands: ['Isover', 'Rockwool'],
  },
  {
    icon: '🚿',
    title: 'Waterbesparende kranen',
    description: 'Installeer waterbesparende douchekoppen en kranen voor lagere waterrekening.',
    saving: 'Besparing: €60/jaar',
    brands: ['Grohe', 'Hansgrohe EcoSmart'],
  },
];

export const BudgetEcoScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Duurzaam klussen</Text>
        <Text style={styles.subtitle}>
          Kies slimmer voor het milieu én je portemonnee
        </Text>

        {/* Eco score overview */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>72%</Text>
          </View>
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreTitle}>Jouw Eco-score</Text>
            <Text style={styles.scoreHint}>
              Op basis van je huidige materiaalkeeuzes
            </Text>
          </View>
        </View>

        {/* Tips */}
        {ECO_TIPS.map((tip, i) => (
          <View key={i} style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipIcon}>{tip.icon}</Text>
              <View style={styles.tipHeaderInfo}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipSaving}>{tip.saving}</Text>
              </View>
            </View>
            <Text style={styles.tipDescription}>{tip.description}</Text>
            <View style={styles.brandRow}>
              {tip.brands.map((brand, j) => (
                <View key={j} style={styles.brandChip}>
                  <Text style={styles.brandText}>{brand}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* CTA */}
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>🌱 Bereken mijn totale eco-impact</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  title: { ...typography.h2, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary },
  scoreCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.lg,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#27AE60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: { ...typography.h2, color: '#FFFFFF' },
  scoreInfo: { flex: 1, gap: spacing.xs },
  scoreTitle: { ...typography.h3, color: colors.text },
  scoreHint: { ...typography.caption, color: colors.textSecondary },
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  tipHeader: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  tipIcon: { fontSize: 32 },
  tipHeaderInfo: { flex: 1 },
  tipTitle: { ...typography.body, color: colors.text, fontWeight: '700' },
  tipSaving: { ...typography.caption, color: '#27AE60', fontWeight: '600' },
  tipDescription: { ...typography.body, color: colors.textSecondary },
  brandRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  brandChip: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  brandText: { ...typography.caption, color: colors.text },
  ctaButton: {
    backgroundColor: '#27AE60',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  ctaText: { ...typography.button, color: '#FFFFFF' },
});
