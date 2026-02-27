import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useCartStore } from '../../store/cartStore';

interface ShoppingCartSummaryProps {
  onCheckout?: () => void;
  onOpenStore?: (store: string) => void;
}

export const ShoppingCartSummary: React.FC<ShoppingCartSummaryProps> = ({
  onCheckout,
  onOpenStore,
}) => {
  const { items, removeItem, updateQuantity, totalCost } = useCartStore();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Je winkelwagen is leeg</Text>
        <Text style={styles.emptyHint}>
          Voeg producten toe vanuit een klusplan of de productzoeker
        </Text>
      </View>
    );
  }

  // Group items by store
  const storeGroups = items.reduce(
    (groups: Record<string, typeof items>, item) => {
      const store = item.store || 'Overig';
      if (!groups[store]) groups[store] = [];
      groups[store].push(item);
      return groups;
    },
    {},
  );

  return (
    <View style={styles.container}>
      {Object.entries(storeGroups).map(([store, storeItems]) => (
        <View key={store} style={styles.storeSection}>
          <TouchableOpacity
            style={styles.storeHeader}
            onPress={() => onOpenStore?.(store)}
          >
            <Text style={styles.storeName}>{store}</Text>
            <Text style={styles.storeLink}>Bekijk winkel →</Text>
          </TouchableOpacity>

          {storeItems.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemPrice}>
                  €{item.price.toFixed(2)} × {item.quantity}
                </Text>
              </View>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    item.quantity > 1
                      ? updateQuantity(item.id, item.quantity - 1)
                      : removeItem(item.id)
                  }
                >
                  <Text style={styles.quantityText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.lineTotal}>
                €{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      ))}

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Totaal</Text>
        <Text style={styles.totalAmount}>€{totalCost().toFixed(2)}</Text>
      </View>

      {onCheckout && (
        <TouchableOpacity style={styles.checkoutButton} onPress={onCheckout}>
          <Text style={styles.checkoutText}>🛒 Afrekenen</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { ...typography.h3, color: colors.text },
  emptyHint: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  storeSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  storeName: { ...typography.body, color: colors.text, fontWeight: '700' },
  storeLink: { ...typography.caption, color: colors.primary },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { ...typography.body, color: colors.text },
  itemPrice: { ...typography.caption, color: colors.textSecondary },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantityText: { fontSize: 16, color: colors.text, fontWeight: '600' },
  quantityValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  lineTotal: { ...typography.body, color: colors.primary, fontWeight: '700' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  totalLabel: { ...typography.h3, color: colors.text },
  totalAmount: { ...typography.h2, color: colors.primary },
  checkoutButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  checkoutText: { ...typography.button, color: colors.textInverse, fontSize: 16 },
});
