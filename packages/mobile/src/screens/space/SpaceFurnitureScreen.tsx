import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

const FURNITURE_CATEGORIES = [
  { key: 'all', label: 'Alles' },
  { key: 'seating', label: 'Zitmeubels' },
  { key: 'tables', label: 'Tafels' },
  { key: 'storage', label: 'Opbergen' },
  { key: 'lighting', label: 'Verlichting' },
  { key: 'decor', label: 'Decoratie' },
];

const FURNITURE_ITEMS = [
  { id: '1', name: 'KIVIK Zitbank', brand: 'IKEA', price: 599, category: 'seating', icon: '🛋️' },
  { id: '2', name: 'LACK Salontafel', brand: 'IKEA', price: 29.99, category: 'tables', icon: '🪵' },
  { id: '3', name: 'KALLAX Stellingkast', brand: 'IKEA', price: 79, category: 'storage', icon: '📚' },
  { id: '4', name: 'HEKTAR Vloerlamp', brand: 'IKEA', price: 49.99, category: 'lighting', icon: '💡' },
  { id: '5', name: 'Eetkamerstoel', brand: 'Kwantum', price: 89, category: 'seating', icon: '🪑' },
  { id: '6', name: 'Dressoir Eiken', brand: 'Kwantum', price: 349, category: 'storage', icon: '🗄️' },
  { id: '7', name: 'Hanglamp Industrieel', brand: 'Kwantum', price: 59.99, category: 'lighting', icon: '🔦' },
  { id: '8', name: 'Spiegel Rond', brand: 'IKEA', price: 39.99, category: 'decor', icon: '🪞' },
];

export const SpaceFurnitureScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = FURNITURE_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meubelbibliotheek</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Zoek meubels..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category filter */}
      <FlatList
        horizontal
        data={FURNITURE_CATEGORIES}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              selectedCategory === item.key && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(item.key)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item.key && styles.categoryTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Furniture grid */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.furnitureCard}>
            <Text style={styles.furnitureIcon}>{item.icon}</Text>
            <Text style={styles.furnitureName}>{item.name}</Text>
            <Text style={styles.furnitureBrand}>{item.brand}</Text>
            <Text style={styles.furniturePrice}>€{item.price.toFixed(2)}</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addText}>+ Plaatsen</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.md, gap: spacing.sm },
  title: { ...typography.h2, color: colors.text },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryList: { paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.md },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: { ...typography.bodySmall, color: colors.text },
  categoryTextActive: { color: colors.textInverse },
  grid: { paddingHorizontal: spacing.md, gap: spacing.md },
  gridRow: { justifyContent: 'space-between' },
  furnitureCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  furnitureIcon: { fontSize: 40, marginBottom: spacing.xs },
  furnitureName: { ...typography.bodySmall, color: colors.text, fontWeight: '600', textAlign: 'center' },
  furnitureBrand: { ...typography.caption, color: colors.textSecondary },
  furniturePrice: { ...typography.body, color: colors.primary, fontWeight: '700' },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  addText: { ...typography.caption, color: colors.textInverse, fontWeight: '600' },
});
