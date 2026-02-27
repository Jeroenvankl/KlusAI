import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

export const SpaceScanScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const steps = [
    { title: 'Overzichtsfoto', hint: 'Maak een foto van de hele ruimte' },
    { title: 'Linkermuur', hint: 'Richt de camera op de linkermuur' },
    { title: 'Rechtermuur', hint: 'Richt de camera op de rechtermuur' },
    { title: 'Details', hint: 'Neem belangrijke details op (ramen, deuren)' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ruimte scannen</Text>
        <Text style={styles.stepIndicator}>
          Stap {step} van {totalSteps}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` }]} />
      </View>

      {/* Camera placeholder */}
      <View style={styles.cameraView}>
        <Text style={styles.cameraIcon}>📷</Text>
        <Text style={styles.cameraTitle}>{steps[step - 1].title}</Text>
        <Text style={styles.cameraHint}>{steps[step - 1].hint}</Text>
        <TouchableOpacity style={styles.captureButton}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navButton, step === 1 && styles.navButtonDisabled]}
          onPress={() => step > 1 && setStep(step - 1)}
        >
          <Text style={styles.navText}>← Vorige</Text>
        </TouchableOpacity>
        {step < totalSteps ? (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setStep(step + 1)}
          >
            <Text style={styles.navText}>Volgende →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={() => navigation.navigate('SpaceModel', { roomId: 'new' })}
          >
            <Text style={styles.finishText}>✓ Voltooien</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  title: { ...typography.h2, color: colors.text },
  stepIndicator: { ...typography.bodySmall, color: colors.textSecondary },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  cameraView: {
    flex: 1,
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  cameraIcon: { fontSize: 64 },
  cameraTitle: { ...typography.h3, color: colors.text },
  cameraHint: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    gap: spacing.md,
  },
  navButton: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  navButtonDisabled: { opacity: 0.4 },
  navText: { ...typography.button, color: colors.text },
  finishButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  finishText: { ...typography.button, color: colors.textInverse },
});
