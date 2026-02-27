import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

export const PaintCompareScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Kleuren vergelijken</Text>
        <Text style={styles.subtitle}>
          Selecteer meerdere kleuren om ze naast elkaar te zien
        </Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>🔄</Text>
          <Text style={styles.placeholderText}>
            Voeg kleuren toe via het verfvoorbeeld scherm
          </Text>
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
  placeholder: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  placeholderIcon: { fontSize: 48 },
  placeholderText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
