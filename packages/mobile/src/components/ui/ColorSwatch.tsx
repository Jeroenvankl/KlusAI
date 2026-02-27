import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface ColorSwatchProps {
  hex: string;
  name?: string;
  brand?: string;
  isSelected?: boolean;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

const SIZES = {
  small: 36,
  medium: 50,
  large: 64,
};

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  hex,
  name,
  brand,
  isSelected = false,
  onPress,
  size = 'medium',
}) => {
  const swatchSize = SIZES[size];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, { width: swatchSize + (name ? 20 : 0) }]}
    >
      <View
        style={[
          styles.swatch,
          {
            width: swatchSize,
            height: swatchSize,
            backgroundColor: hex,
            borderRadius: swatchSize / 2,
          },
          isSelected && styles.selected,
        ]}
      />
      {name && (
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
      )}
      {brand && (
        <Text style={styles.brand} numberOfLines={1}>
          {brand}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  swatch: {
    borderWidth: 2,
    borderColor: colors.border,
  },
  selected: {
    borderColor: colors.primary,
    borderWidth: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  name: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center',
  },
  brand: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 10,
  },
});
