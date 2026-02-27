import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface CostItem {
  id: string;
  label: string;
  amount: number;
}

export const BudgetCalculatorScreen = () => {
  const [items, setItems] = useState<CostItem[]>([
    { id: '1', label: 'Verf (3 blikken)', amount: 89.97 },
    { id: '2', label: 'Kwasten & rollers', amount: 24.50 },
    { id: '3', label: 'Afplaktape', amount: 8.99 },
    { id: '4', label: 'Grondverf', amount: 32.00 },
  ]);
  const [newLabel, setNewLabel] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const addItem = () => {
    if (newLabel && newAmount) {
      setItems([
        ...items,
        { id: Date.now().toString(), label: newLabel, amount: parseFloat(newAmount) || 0 },
      ]);
      setNewLabel('');
      setNewAmount('');
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Budgetcalculator</Text>

        {/* Cost items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kostenposten</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.costRow}>
              <Text style={styles.costLabel}>{item.label}</Text>
              <Text style={styles.costAmount}>€{item.amount.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Text style={styles.removeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Add new item */}
          <View style={styles.addRow}>
            <TextInput
              style={styles.addInput}
              placeholder="Omschrijving"
              placeholderTextColor={colors.textSecondary}
              value={newLabel}
              onChangeText={setNewLabel}
            />
            <TextInput
              style={styles.addAmountInput}
              placeholder="€"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
              value={newAmount}
              onChangeText={setNewAmount}
            />
            <TouchableOpacity style={styles.addButton} onPress={addItem}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Totaal geschat</Text>
          <Text style={styles.totalAmount}>€{total.toFixed(2)}</Text>
        </View>

        {/* Budget tips */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💡 Bespaartips</Text>
          {[
            'Vergelijk prijzen tussen Gamma, Praxis en Karwei',
            'Koop verf in grotere blikken voor een lagere literprijs',
            'Hergebruik kwasten door ze goed schoon te maken',
            'Let op actiefolders en kortingscodes',
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  title: { ...typography.h2, color: colors.text },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  costLabel: { ...typography.body, color: colors.text, flex: 1 },
  costAmount: { ...typography.body, color: colors.text, fontWeight: '600' },
  removeBtn: { fontSize: 16, color: colors.error, padding: spacing.xs },
  addRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  addInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    ...typography.body,
    color: colors.text,
  },
  addAmountInput: {
    width: 80,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    ...typography.body,
    color: colors.text,
    textAlign: 'right',
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { fontSize: 20, color: colors.textInverse, fontWeight: '700' },
  totalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { ...typography.h3, color: colors.text },
  totalAmount: { ...typography.h2, color: colors.primary },
  tipRow: { flexDirection: 'row', gap: spacing.sm },
  tipBullet: { ...typography.body, color: colors.primary },
  tipText: { ...typography.body, color: colors.text, flex: 1 },
});
