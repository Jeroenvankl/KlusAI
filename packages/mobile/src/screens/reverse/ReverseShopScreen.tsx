import React, { useState } from 'react';
import {
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

const STORE_FILTERS = [
  { key: 'all', label: 'Alle winkels' },
  { key: 'ikea', label: 'IKEA' },
  { key: 'gamma', label: 'Gamma' },
  { key: 'praxis', label: 'Praxis' },
  { key: 'karwei', label: 'Karwei' },
  { key: 'kwantum', label: 'Kwantum' },
];

interface ShopItem {
  id: string;
  name: string;
  store: string;
  price: number;
  originalItem: string;
  matchScore: number;
  url: string;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: '1',
    name: 'KIVIK 3-zits bank',
    store: 'IKEA',
    price: 599,
    originalItem: 'Bank (3-zits)',
    matchScore: 95,
    url: 'https://www.ikea.com/nl/',
  },
  {
    id: '2',
    name: 'STOCKHOLM Salontafel',
    store: 'IKEA',
    price: 249,
    originalItem: 'Salontafel (rond)',
    matchScore: 88,
    url: 'https://www.ikea.com/nl/',
  },
  {
    id: '3',
    name: 'LOHALS Vloerkleed jute',
    store: 'IKEA',
    price: 129,
    originalItem: 'Vloerkleed (jute)',
    matchScore: 92,
    url: 'https://www.ikea.com/nl/',
  },
  {
    id: '4',
    name: 'Flexa Creations Sandy Beach 5L',
    store: 'Gamma',
    price: 44.99,
    originalItem: 'Muurverf',
    matchScore: 97,
    url: 'https://www.gamma.nl/',
  },
  {
    id: '5',
    name: 'HEKTAR Staande lamp',
    store: 'IKEA',
    price: 49.99,
    originalItem: 'Staande lamp',
    matchScore: 90,
    url: 'https://www.ikea.com/nl/',
  },
  {
    id: '6',
    name: 'Eiken laminaat Select',
    store: 'Gamma',
    price: 24.99,
    originalItem: 'Vloer (per m²)',
    matchScore: 85,
    url: 'https://www.gamma.nl/',
  },
  {
    id: '7',
    name: 'Eiken laminaat Premium',
    store: 'Praxis',
    price: 29.99,
    originalItem: 'Vloer (per m²)',
    matchScore: 91,
    url: 'https://www.praxis.nl/',
  },
];

export const ReverseShopScreen = () => {
  const [selectedStore, setSelectedStore] = useState('all');

  const filtered = SHOP_ITEMS.filter(
    (item) => selectedStore === 'all' || item.store.toLowerCase() === selectedStore,
  );

  const total = filtered.reduce((sum, item) => sum + item.price, 0);

  const openStore = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Winkel overzicht</Text>
        <Text style={styles.subtitle}>
          Producten gevonden bij Nederlandse winkels
        </Text>
      </View>

      {/* Store filter */}
      <FlatList
        horizontal
        data={STORE_FILTERS}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedStore === item.key && styles.filterChipActive,
            ]}
            onPress={() => setSelectedStore(item.key)}
          >
            <Text
              style={[
                styles.filterText,
                selectedStore === item.key && styles.filterTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Product list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.productHeader}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productStore}>{item.store}</Text>
              </View>
              <Text style={styles.productPrice}>€{item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.productFooter}>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{item.matchScore}% match</Text>
              </View>
              <Text style={styles.originalItem}>
                Past bij: {item.originalItem}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.openButton}
              onPress={() => openStore(item.url)}
            >
              <Text style={styles.openText}>Bekijk in winkel →</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Total footer */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>{filtered.length} producten</Text>
          <Text style={styles.footerTotal}>Totaal: €{total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartText}>🛒 Alles toevoegen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.md, gap: spacing.xs },
  title: { ...typography.h2, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary },
  filterList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: { ...typography.bodySmall, color: colors.text },
  filterTextActive: { color: colors.textInverse },
  list: { padding: spacing.md, gap: spacing.md },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productInfo: { flex: 1, gap: 2 },
  productName: { ...typography.body, color: colors.text, fontWeight: '600' },
  productStore: { ...typography.caption, color: colors.textSecondary },
  productPrice: { ...typography.h3, color: colors.primary },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  matchBadge: {
    backgroundColor: '#D5F5E3',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  matchText: { ...typography.caption, color: '#27AE60', fontWeight: '600' },
  originalItem: { ...typography.caption, color: colors.textSecondary },
  openButton: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    alignItems: 'center',
  },
  openText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  footerInfo: { flex: 1 },
  footerLabel: { ...typography.caption, color: colors.textSecondary },
  footerTotal: { ...typography.h3, color: colors.text },
  cartButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  cartText: { ...typography.button, color: colors.textInverse },
});
