import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

export const SpaceHomeScreen = ({ navigation }: any) => {
  const rooms = [
    { id: '1', name: 'Woonkamer', icon: '🛋️', status: 'Gescand' },
    { id: '2', name: 'Slaapkamer', icon: '🛏️', status: 'Niet gescand' },
    { id: '3', name: 'Keuken', icon: '🍳', status: 'Niet gescand' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mijn Ruimte</Text>
        <Text style={styles.subtitle}>
          Maak een digitaal model van je woning
        </Text>

        {/* Scan button */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('SpaceScan')}
        >
          <Text style={styles.scanIcon}>📐</Text>
          <Text style={styles.scanText}>Nieuwe ruimte scannen</Text>
          <Text style={styles.scanHint}>Maak foto's vanuit meerdere hoeken</Text>
        </TouchableOpacity>

        {/* Room list */}
        <Text style={styles.sectionTitle}>Mijn kamers</Text>
        {rooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            style={styles.roomCard}
            onPress={() => navigation.navigate('SpaceModel', { roomId: room.id })}
          >
            <Text style={styles.roomIcon}>{room.icon}</Text>
            <View style={styles.roomInfo}>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.roomStatus}>{room.status}</Text>
            </View>
            <Text style={styles.roomArrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Furniture library */}
        <TouchableOpacity
          style={styles.furnitureLink}
          onPress={() => navigation.navigate('SpaceFurniture')}
        >
          <Text style={styles.furnitureLinkIcon}>🪑</Text>
          <Text style={styles.furnitureLinkText}>Meubelbibliotheek bekijken</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.lg },
  title: { ...typography.h2, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary },
  scanButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  scanIcon: { fontSize: 48, marginBottom: spacing.sm },
  scanText: { ...typography.button, color: colors.text },
  scanHint: { ...typography.caption, color: colors.textSecondary },
  sectionTitle: { ...typography.h3, color: colors.text },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  roomIcon: { fontSize: 32 },
  roomInfo: { flex: 1 },
  roomName: { ...typography.body, color: colors.text, fontWeight: '600' },
  roomStatus: { ...typography.caption, color: colors.textSecondary },
  roomArrow: { fontSize: 24, color: colors.textSecondary },
  furnitureLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  furnitureLinkIcon: { fontSize: 24 },
  furnitureLinkText: { ...typography.body, color: colors.primary, fontWeight: '600' },
});
