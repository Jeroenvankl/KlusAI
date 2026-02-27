import React from 'react';
import {
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCartStore } from '../../store/cartStore';
import { colors, typography, spacing, borderRadius } from '../../theme';

export const PaintCartScreen = () => {
  const { items, removeItem, totalCost } = useCartStore();
  const paintItems = items.filter((i) => i.type === 'paint');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Winkelwagen</Text>
      {paintItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Je winkelwagen is leeg</Text>
          <Text style={styles.emptyHint}>
            Selecteer kleuren en voeg ze toe aan je winkelwagen
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={paintItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View
                  style={[styles.colorDot, { backgroundColor: item.name }]}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemStore}>{item.store}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  {item.price ? `€${item.price.toFixed(2)}` : '-'}
                </Text>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Text style={styles.removeButton}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Totaal geschat</Text>
            <Text style={styles.totalAmount}>€{totalCost().toFixed(2)}</Text>
          </View>
          <View style={styles.storeButtons}>
            {['Gamma', 'Praxis', 'IKEA'].map((store) => (
              <TouchableOpacity
                key={store}
                style={styles.storeButton}
                onPress={() =>
                  Linking.openURL(
                    store === 'Gamma'
                      ? 'https://www.gamma.nl'
                      : store === 'Praxis'
                        ? 'https://www.praxis.nl'
                        : 'https://www.ikea.com/nl/nl',
                  )
                }
              >
                <Text style={styles.storeButtonText}>
                  🔗 {store}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.md },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  emptyIcon: { fontSize: 64 },
  emptyText: { ...typography.h3, color: colors.text },
  emptyHint: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  list: { gap: spacing.sm },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  colorDot: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  itemInfo: { flex: 1 },
  itemName: { ...typography.body, color: colors.text, fontWeight: '600' },
  itemStore: { ...typography.caption, color: colors.textSecondary },
  itemPrice: { ...typography.body, color: colors.text, fontWeight: '700' },
  removeButton: { fontSize: 18, color: colors.error, padding: spacing.xs },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginTop: spacing.md,
  },
  totalLabel: { ...typography.h3, color: colors.text },
  totalAmount: { ...typography.h2, color: colors.primary },
  storeButtons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  storeButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  storeButtonText: { ...typography.button, color: colors.textInverse, fontSize: 13 },
});
