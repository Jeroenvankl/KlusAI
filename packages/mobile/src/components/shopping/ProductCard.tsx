import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface ProductCardProps {
  name: string;
  brand: string;
  store: string;
  price: number;
  unit?: string;
  ecoScore?: number;
  inStock?: boolean;
  productUrl?: string;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  brand,
  store,
  price,
  unit = 'stuk',
  ecoScore,
  inStock = true,
  productUrl,
  onAddToCart,
}) => {
  const handleOpenStore = () => {
    if (productUrl) {
      Linking.openURL(productUrl).catch(() => {});
    }
  };

  return (
    <View style={[styles.container, !inStock && styles.outOfStock]}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.brand}>{brand}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>€{price.toFixed(2)}</Text>
          <Text style={styles.unit}>per {unit}</Text>
        </View>
      </View>

      <View style={styles.meta}>
        <View style={styles.storeBadge}>
          <Text style={styles.storeText}>{store}</Text>
        </View>
        {ecoScore != null && ecoScore > 0 && (
          <Text style={styles.eco}>🌱 {ecoScore}%</Text>
        )}
        {!inStock && <Text style={styles.stockWarning}>Niet op voorraad</Text>}
      </View>

      <View style={styles.actions}>
        {productUrl && (
          <TouchableOpacity style={styles.viewButton} onPress={handleOpenStore}>
            <Text style={styles.viewText}>Bekijk →</Text>
          </TouchableOpacity>
        )}
        {onAddToCart && inStock && (
          <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
            <Text style={styles.addText}>+ Toevoegen</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  outOfStock: { opacity: 0.6 },
  header: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  info: { flex: 1, gap: 2 },
  name: { ...typography.body, color: colors.text, fontWeight: '600' },
  brand: { ...typography.caption, color: colors.textSecondary },
  priceContainer: { alignItems: 'flex-end' },
  price: { ...typography.h3, color: colors.primary },
  unit: { ...typography.caption, color: colors.textSecondary },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  storeBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  storeText: { ...typography.caption, color: colors.text, fontWeight: '600' },
  eco: { ...typography.caption, color: '#27AE60' },
  stockWarning: { ...typography.caption, color: colors.error },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  viewButton: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  addButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  addText: { ...typography.bodySmall, color: colors.textInverse, fontWeight: '600' },
});
