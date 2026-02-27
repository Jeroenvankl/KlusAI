import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

export const ReverseAnalysisScreen = ({ route, navigation }: any) => {
  const source = route?.params?.source || 'camera';
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Mock analysis result
  const mockResult = {
    style: 'Scandinavisch Modern',
    confidence: 92,
    colors: [
      { hex: '#F5F0E8', name: 'Warm Wit', area: '45%' },
      { hex: '#8B9E8B', name: 'Salie Groen', area: '20%' },
      { hex: '#C4A882', name: 'Naturel Hout', area: '25%' },
      { hex: '#2C3E50', name: 'Donker Accent', area: '10%' },
    ],
    furniture: [
      { item: 'Bank (3-zits)', match: 'KIVIK - IKEA', price: '€599' },
      { item: 'Salontafel (rond)', match: 'STOCKHOLM - IKEA', price: '€249' },
      { item: 'Vloerkleed (jute)', match: 'LOHALS - IKEA', price: '€129' },
      { item: 'Staande lamp', match: 'HEKTAR - IKEA', price: '€49' },
      { item: 'Kussen set', match: 'GURLI - IKEA', price: '€8 p/st' },
    ],
    materials: [
      { type: 'Muurverf', suggestion: 'Flexa Creations - Sandy Beach', price: '€44.99/5L' },
      { type: 'Vloer', suggestion: 'Eiken laminaat - Gamma', price: '€24.99/m²' },
    ],
    totalEstimate: 1350,
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setResult(mockResult);
      setAnalyzing(false);
    }, 2000);
  };

  if (analyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingTitle}>Analyseren...</Text>
          <Text style={styles.loadingHint}>
            Onze AI herkent stijl, kleuren, meubels en materialen
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!result) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.uploadView}>
          <Text style={styles.uploadIcon}>🖼️</Text>
          <Text style={styles.uploadTitle}>Foto geselecteerd</Text>
          <Text style={styles.uploadHint}>
            Bron: {source === 'camera' ? 'Camera' : source === 'gallery' ? 'Galerij' : source}
          </Text>
          <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
            <Text style={styles.analyzeText}>🔍 Start analyse</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Analyse resultaat</Text>

        {/* Style identification */}
        <View style={styles.styleCard}>
          <Text style={styles.styleLabel}>Herkende stijl</Text>
          <Text style={styles.styleName}>{result.style}</Text>
          <Text style={styles.styleConfidence}>
            {result.confidence}% zekerheid
          </Text>
        </View>

        {/* Colors found */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎨 Gevonden kleuren</Text>
          {result.colors.map((c: any, i: number) => (
            <View key={i} style={styles.colorRow}>
              <View style={[styles.colorDot, { backgroundColor: c.hex }]} />
              <Text style={styles.colorName}>{c.name}</Text>
              <Text style={styles.colorHex}>{c.hex}</Text>
              <Text style={styles.colorArea}>{c.area}</Text>
            </View>
          ))}
        </View>

        {/* Furniture matches */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛋️ Meubel matches</Text>
          {result.furniture.map((f: any, i: number) => (
            <View key={i} style={styles.furnitureRow}>
              <View style={styles.furnitureInfo}>
                <Text style={styles.furnitureItem}>{f.item}</Text>
                <Text style={styles.furnitureMatch}>{f.match}</Text>
              </View>
              <Text style={styles.furniturePrice}>{f.price}</Text>
            </View>
          ))}
        </View>

        {/* Materials */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏗️ Materialen</Text>
          {result.materials.map((m: any, i: number) => (
            <View key={i} style={styles.materialRow}>
              <View style={styles.materialInfo}>
                <Text style={styles.materialType}>{m.type}</Text>
                <Text style={styles.materialSuggestion}>{m.suggestion}</Text>
              </View>
              <Text style={styles.materialPrice}>{m.price}</Text>
            </View>
          ))}
        </View>

        {/* Total estimate */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Geschatte totaalkosten</Text>
          <Text style={styles.totalAmount}>~€{result.totalEstimate}</Text>
        </View>

        {/* Shop button */}
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('ReverseShop', { result })}
        >
          <Text style={styles.shopText}>🛒 Bekijk in winkels</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingTitle: { ...typography.h3, color: colors.text },
  loadingHint: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  uploadView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  uploadIcon: { fontSize: 80 },
  uploadTitle: { ...typography.h3, color: colors.text },
  uploadHint: { ...typography.body, color: colors.textSecondary },
  analyzeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  analyzeText: { ...typography.button, color: colors.textInverse, fontSize: 16 },
  title: { ...typography.h2, color: colors.text },
  styleCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  styleLabel: { ...typography.caption, color: 'rgba(255,255,255,0.8)' },
  styleName: { ...typography.h2, color: colors.textInverse },
  styleConfidence: { ...typography.bodySmall, color: 'rgba(255,255,255,0.8)' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorName: { ...typography.body, color: colors.text, flex: 1 },
  colorHex: {
    ...typography.caption,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  colorArea: { ...typography.bodySmall, color: colors.textSecondary },
  furnitureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  furnitureInfo: { flex: 1 },
  furnitureItem: { ...typography.body, color: colors.text, fontWeight: '600' },
  furnitureMatch: { ...typography.caption, color: colors.textSecondary },
  furniturePrice: { ...typography.body, color: colors.primary, fontWeight: '700' },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  materialInfo: { flex: 1 },
  materialType: { ...typography.body, color: colors.text, fontWeight: '600' },
  materialSuggestion: { ...typography.caption, color: colors.textSecondary },
  materialPrice: { ...typography.body, color: colors.primary, fontWeight: '700' },
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
  shopButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  shopText: { ...typography.button, color: colors.textInverse, fontSize: 16 },
});
