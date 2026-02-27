import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SpaceHomeScreen } from '../../screens/space/SpaceHomeScreen';
import { SpaceScanScreen } from '../../screens/space/SpaceScanScreen';
import { SpaceModelScreen } from '../../screens/space/SpaceModelScreen';
import { SpaceFurnitureScreen } from '../../screens/space/SpaceFurnitureScreen';
import { colors, typography } from '../../theme';

export type SpaceStackParamList = {
  SpaceHome: undefined;
  SpaceScan: undefined;
  SpaceModel: { roomId: string };
  SpaceFurniture: { roomId?: string };
};

const Stack = createNativeStackNavigator<SpaceStackParamList>();

export const SpaceStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
      headerTitleStyle: { ...typography.body, fontWeight: '600' },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen
      name="SpaceHome"
      component={SpaceHomeScreen}
      options={{ title: 'Mijn Ruimte' }}
    />
    <Stack.Screen
      name="SpaceScan"
      component={SpaceScanScreen}
      options={{ title: 'Scannen' }}
    />
    <Stack.Screen
      name="SpaceModel"
      component={SpaceModelScreen}
      options={{ title: 'Ruimtemodel' }}
    />
    <Stack.Screen
      name="SpaceFurniture"
      component={SpaceFurnitureScreen}
      options={{ title: 'Meubelbibliotheek' }}
    />
  </Stack.Navigator>
);
