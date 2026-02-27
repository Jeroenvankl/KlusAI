import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography, spacing } from '../../theme';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onValueChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  onValueChange,
  leftLabel,
  rightLabel,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.sliderRow}>
        {leftLabel && <Text style={styles.rangeLabel}>{leftLabel}</Text>}
        <View style={styles.trackContainer}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${percentage}%` }]} />
            <View style={[styles.thumb, { left: `${percentage}%` }]} />
          </View>
        </View>
        {rightLabel && <Text style={styles.rangeLabel}>{rightLabel}</Text>}
      </View>
      <Text style={styles.value}>{Math.round(value)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  label: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rangeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 40,
  },
  trackContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    top: -8,
    marginLeft: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  value: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
