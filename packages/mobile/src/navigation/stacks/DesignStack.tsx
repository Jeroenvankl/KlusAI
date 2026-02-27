import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DesignHomeScreen } from '../../screens/design/DesignHomeScreen';
import { DesignResultScreen } from '../../screens/design/DesignResultScreen';
import { DesignDetailScreen } from '../../screens/design/DesignDetailScreen';
import { colors, typography } from '../../theme';

export type DesignStackParamList = {
  DesignHome: undefined;
  DesignResult: { style: string };
  DesignDetail: { style: string };
};

const Stack = createNativeStackNavigator<DesignStackParamList>();

export const DesignStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
      headerTitleStyle: { ...typography.body, fontWeight: '600' },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen
      name="DesignHome"
      component={DesignHomeScreen}
      options={{ title: 'Ontwerp & Inspiratie' }}
    />
    <Stack.Screen
      name="DesignResult"
      component={DesignResultScreen}
      options={{ title: 'Resultaat' }}
    />
    <Stack.Screen
      name="DesignDetail"
      component={DesignDetailScreen}
      options={{ title: 'Details' }}
    />
  </Stack.Navigator>
);
