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

const EXAMPLES = [
  {
    icon: '🛋️',
    title: 'Woonkamer inspiratie',
    description: 'Ontdek meubels en kleuren uit een Pinterest-foto',
  },
  {
    icon: '🍳',
    title: 'Keuken design',
    description: 'Vind vergelijkbare keukens bij Nederlandse winkels',
  },
  {
    icon: '🛏️',
    title: 'Slaapkamer stijl',
    description: 'Kopieer de look van een hotelkamer of magazine',
  },
  {
    icon: '🪴',
    title: 'Tuin & balkon',
    description: 'Recreëer die perfecte buitenruimte',
  },
];

export const ReverseHomeScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Voorbeeld Nadoen</Text>
        <Text style={styles.subtitle}>
          Upload een foto van een interieur dat je mooi vindt en wij vertellen
          je precies hoe je het kunt namaken
        </Text>

        {/* Upload area */}
        <TouchableOpacity
          style={styles.uploadArea}
          onPress={() =>
            navigation.navigate('ReverseAnalysis', { source: 'camera' })
          }
        >
          <Text style={styles.uploadIcon}>📸</Text>
          <Text style={styles.uploadText}>Maak een foto of upload afbeelding</Text>
          <Text style={styles.uploadHint}>
            Onze AI analyseert kleuren, meubels, materialen en stijl
          </Text>
        </TouchableOpacity>

        {/* Source buttons */}
        <View style={styles.sourceRow}>
          <TouchableOpacity
            style={styles.sourceButton}
            onPress={() =>
              navigation.navigate('ReverseAnalysis', { source: 'gallery' })
            }
          >
            <Text style={styles.sourceIcon}>🖼️</Text>
            <Text style={styles.sourceText}>Galerij</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sourceButton}
            onPress={() =>
              navigation.navigate('ReverseAnalysis', { source: 'pinterest' })
            }
          >
            <Text style={styles.sourceIcon}>📌</Text>
            <Text style={styles.sourceText}>Pinterest URL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sourceButton}
            onPress={() =>
              navigation.navigate('ReverseAnalysis', { source: 'screenshot' })
            }
          >
            <Text style={styles.sourceIcon}>📱</Text>
            <Text style={styles.sourceText}>Screenshot</Text>
          </TouchableOpacity>
        </View>

        {/* Examples */}
        <Text style={styles.sectionTitle}>Voorbeelden</Text>
        {EXAMPLES.map((example, i) => (
          <TouchableOpacity
            key={i}
            style={styles.exampleCard}
            onPress={() =>
              navigation.navigate('ReverseAnalysis', { source: 'example' })
            }
          >
            <Text style={styles.exampleIcon}>{example.icon}</Text>
            <View style={styles.exampleInfo}>
              <Text style={styles.exampleTitle}>{example.title}</Text>
              <Text style={styles.exampleDesc}>{example.description}</Text>
            </View>
            <Text style={styles.exampleArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.lg },
  title: { ...typography.h2, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary },
  uploadArea: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    gap: spacing.sm,
  },
  uploadIcon: { fontSize: 56 },
  uploadText: { ...typography.button, color: colors.text },
  uploadHint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sourceRow: { flexDirection: 'row', gap: spacing.md },
  sourceButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sourceIcon: { fontSize: 24 },
  sourceText: { ...typography.caption, color: colors.text, fontWeight: '600' },
  sectionTitle: { ...typography.h3, color: colors.text },
  exampleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  exampleIcon: { fontSize: 32 },
  exampleInfo: { flex: 1, gap: 2 },
  exampleTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  exampleDesc: { ...typography.caption, color: colors.textSecondary },
  exampleArrow: { fontSize: 24, color: colors.textSecondary },
});
