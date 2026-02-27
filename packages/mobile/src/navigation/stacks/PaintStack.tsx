import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaintHomeScreen } from '../../screens/paint/PaintHomeScreen';
import { PaintPreviewScreen } from '../../screens/paint/PaintPreviewScreen';
import { PaintCompareScreen } from '../../screens/paint/PaintCompareScreen';
import { PaintCartScreen } from '../../screens/paint/PaintCartScreen';
import { colors, typography } from '../../theme';

export type PaintStackParamList = {
  PaintHome: undefined;
  PaintPreview: { imageUri?: string };
  PaintCompare: undefined;
  PaintCart: undefined;
};

const Stack = createNativeStackNavigator<PaintStackParamList>();

export const PaintStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
      headerTitleStyle: { ...typography.body, fontWeight: '600' },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen
      name="PaintHome"
      component={PaintHomeScreen}
      options={{ title: 'Verf & Kleuren' }}
    />
    <Stack.Screen
      name="PaintPreview"
      component={PaintPreviewScreen}
      options={{ title: 'Voorbeeld' }}
    />
    <Stack.Screen
      name="PaintCompare"
      component={PaintCompareScreen}
      options={{ title: 'Vergelijken' }}
    />
    <Stack.Screen
      name="PaintCart"
      component={PaintCartScreen}
      options={{ title: 'Winkelwagen' }}
    />
  </Stack.Navigator>
);
