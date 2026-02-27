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
import { colors, typography, spacing, borderRadius } from '../../theme';

const DESIGN_STYLES = [
  { key: 'japandi', icon: '🎋', name: 'Japandi', description: 'Japans minimalisme meets Scandinavisch comfort', color: '#E8DDD0' },
  { key: 'scandinavian', icon: '🌿', name: 'Scandinavisch', description: 'Licht, functioneel en gezellig', color: '#E8EDE4' },
  { key: 'industrial', icon: '⚙️', name: 'Industrieel', description: 'Ruw, stoer met warme accenten', color: '#D5D0CB' },
  { key: 'modern', icon: '✨', name: 'Modern', description: 'Strakke lijnen en gedurfde keuzes', color: '#D8E0E8' },
  { key: 'bohemian', icon: '🌺', name: 'Bohemian', description: 'Kleurrijk, eclectisch en persoonlijk', color: '#F0E0D0' },
  { key: 'minimalist', icon: '◻️', name: 'Minimalistisch', description: 'Minder is meer, rust en ruimte', color: '#EDEDED' },
];

export const DesignHomeScreen = ({ navigation }: any) => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ontwerp & Inspiratie</Text>
        <Text style={styles.subtitle}>
          Ontdek stijlen en krijg AI-suggesties voor jouw ruimte
        </Text>

        {/* Room analysis button */}
        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={() => navigation.navigate('DesignResult', { style: selectedStyle || 'japandi' })}
        >
          <Text style={styles.analyzeIcon}>📸</Text>
          <Text style={styles.analyzeText}>Analyseer je ruimte</Text>
          <Text style={styles.analyzeHint}>Upload een foto voor gepersonaliseerde suggesties</Text>
        </TouchableOpacity>

        {/* Style selection */}
        <Text style={styles.sectionTitle}>Kies een stijl</Text>
        <View style={styles.styleGrid}>
          {DESIGN_STYLES.map((style) => (
            <TouchableOpacity
              key={style.key}
              style={[
                styles.styleCard,
                { backgroundColor: style.color },
                selectedStyle === style.key && styles.styleCardSelected,
              ]}
              onPress={() => setSelectedStyle(style.key)}
            >
              <Text style={styles.styleIcon}>{style.icon}</Text>
              <Text style={styles.styleName}>{style.name}</Text>
              <Text style={styles.styleDesc}>{style.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Apply button */}
        {selectedStyle && (
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => navigation.navigate('DesignResult', { style: selectedStyle })}
          >
            <Text style={styles.applyText}>✨ Genereer ontwerp</Text>
          </TouchableOpacity>
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
  analyzeButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  analyzeIcon: { fontSize: 48, marginBottom: spacing.sm },
  analyzeText: { ...typography.button, color: colors.text },
  analyzeHint: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  sectionTitle: { ...typography.h3, color: colors.text },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  styleCard: {
    width: '47%',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  styleCardSelected: {
    borderColor: colors.primary,
  },
  styleIcon: { fontSize: 32 },
  styleName: { ...typography.body, color: colors.text, fontWeight: '700' },
  styleDesc: { ...typography.caption, color: colors.textSecondary },
  applyButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  applyText: { ...typography.button, color: colors.textInverse },
});
