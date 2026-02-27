import React from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TileButton } from '../components/ui/TileButton';
import { colors, typography, spacing } from '../theme';

const MODULES = [
  {
    key: 'paint',
    icon: '🎨',
    title: 'Verf & Kleuren',
    subtitle: 'Kleur je muur',
    gradient: ['#FF6B6B', '#EE5A24'] as const,
    route: 'PaintStack',
  },
  {
    key: 'design',
    icon: '🛋️',
    title: 'Ontwerp & Inspiratie',
    subtitle: 'Stijl ontdekken',
    gradient: ['#6C5CE7', '#A29BFE'] as const,
    route: 'DesignStack',
  },
  {
    key: 'space',
    icon: '🧱',
    title: 'Mijn Ruimte',
    subtitle: 'Digitaal model',
    gradient: ['#00B894', '#55E6C1'] as const,
    route: 'SpaceStack',
  },
  {
    key: 'budget',
    icon: '💰',
    title: 'Budget & Duurzaamheid',
    subtitle: 'Slim besparen',
    gradient: ['#FDCB6E', '#F39C12'] as const,
    route: 'BudgetStack',
  },
  {
    key: 'build',
    icon: '🛠️',
    title: 'Bouw & Klushulp',
    subtitle: 'Stap voor stap',
    gradient: ['#E17055', '#D63031'] as const,
    route: 'BuildStack',
  },
  {
    key: 'reverse',
    icon: '📸',
    title: 'Voorbeeld Nadoen',
    subtitle: 'Pinterest → winkel',
    gradient: ['#0984E3', '#74B9FF'] as const,
    route: 'ReverseStack',
  },
];

export const DashboardScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.phoneFrame}>
        <View style={styles.header}>
          <Text style={styles.logo}>🏠 KlusAI</Text>
          <Text style={styles.tagline}>Van idee tot klus</Text>
        </View>
        <FlatList
          data={MODULES}
          numColumns={2}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TileButton
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              gradient={item.gradient}
              onPress={() => navigation.navigate(item.route)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    ...(Platform.OS === 'web' ? { alignItems: 'center' as const } : {}),
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 430 : undefined,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  logo: {
    ...typography.h1,
    color: colors.text,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  grid: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
});
