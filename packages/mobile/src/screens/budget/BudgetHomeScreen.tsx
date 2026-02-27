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

export const BudgetHomeScreen = ({ navigation }: any) => {
  const projects = [
    { id: '1', name: 'Woonkamer renovatie', budget: 2500, spent: 1240, eco: 72 },
    { id: '2', name: 'Badkamer opknappen', budget: 5000, spent: 0, eco: 0 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Budget & Duurzaamheid</Text>
        <Text style={styles.subtitle}>
          Beheer je budget en kies duurzame opties
        </Text>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statValue}>€7.500</Text>
            <Text style={styles.statLabel}>Totaal budget</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statValue}>€1.240</Text>
            <Text style={styles.statLabel}>Besteed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🌱</Text>
            <Text style={styles.statValue}>72%</Text>
            <Text style={styles.statLabel}>Eco-score</Text>
          </View>
        </View>

        {/* Projects */}
        <Text style={styles.sectionTitle}>Projecten</Text>
        {projects.map((project) => {
          const progress = project.budget > 0 ? project.spent / project.budget : 0;
          return (
            <TouchableOpacity
              key={project.id}
              style={styles.projectCard}
              onPress={() => navigation.navigate('BudgetCalculator', { projectId: project.id })}
            >
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectBudget}>€{project.budget}</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress * 100}%` },
                    progress > 0.8 && styles.progressWarning,
                  ]}
                />
              </View>
              <View style={styles.projectFooter}>
                <Text style={styles.projectSpent}>
                  €{project.spent} besteed
                </Text>
                {project.eco > 0 && (
                  <Text style={styles.projectEco}>🌱 {project.eco}%</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.calcButton}
            onPress={() => navigation.navigate('BudgetCalculator')}
          >
            <Text style={styles.calcText}>🧮 Calculator</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ecoButton}
            onPress={() => navigation.navigate('BudgetEco')}
          >
            <Text style={styles.ecoText}>🌱 Eco-tips</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.lg },
  title: { ...typography.h2, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIcon: { fontSize: 24 },
  statValue: { ...typography.h3, color: colors.primary },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  sectionTitle: { ...typography.h3, color: colors.text },
  projectCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectName: { ...typography.body, color: colors.text, fontWeight: '600' },
  projectBudget: { ...typography.body, color: colors.primary, fontWeight: '700' },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressWarning: { backgroundColor: colors.error },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectSpent: { ...typography.caption, color: colors.textSecondary },
  projectEco: { ...typography.caption, color: '#27AE60' },
  actions: { flexDirection: 'row', gap: spacing.md },
  calcButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  calcText: { ...typography.button, color: colors.textInverse },
  ecoButton: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ecoText: { ...typography.button, color: colors.text },
});
