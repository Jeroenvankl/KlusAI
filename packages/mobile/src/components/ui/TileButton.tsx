import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../../theme';

const TILE_GAP = spacing.md;

const getTileWidth = () => {
  const screenWidth = Dimensions.get('window').width;
  // On web, cap to a mobile-like width so tiles stay readable
  const maxWidth = Platform.OS === 'web' ? Math.min(screenWidth, 430) : screenWidth;
  return (maxWidth - TILE_GAP * 3) / 2;
};

const TILE_WIDTH = getTileWidth();
const TILE_HEIGHT = TILE_WIDTH * 0.85;

interface TileButtonProps {
  icon: string;
  title: string;
  subtitle: string;
  gradient: readonly [string, string];
  onPress: () => void;
}

export const TileButton: React.FC<TileButtonProps> = ({
  icon,
  title,
  subtitle,
  gradient,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.container}
    >
      <LinearGradient
        colors={[gradient[0], gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    borderRadius: borderRadius.lg,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  gradient: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 36,
  },
  textContainer: {
    gap: 2,
  },
  title: {
    ...typography.tileTitle,
    color: colors.textInverse,
  },
  subtitle: {
    ...typography.tileSubtitle,
    color: 'rgba(255,255,255,0.8)',
  },
});
