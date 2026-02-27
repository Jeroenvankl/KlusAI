import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReverseHomeScreen } from '../../screens/reverse/ReverseHomeScreen';
import { ReverseAnalysisScreen } from '../../screens/reverse/ReverseAnalysisScreen';
import { ReverseShopScreen } from '../../screens/reverse/ReverseShopScreen';
import { colors, typography } from '../../theme';

export type ReverseStackParamList = {
  ReverseHome: undefined;
  ReverseAnalysis: { source: string };
  ReverseShop: { result?: any };
};

const Stack = createNativeStackNavigator<ReverseStackParamList>();

export const ReverseStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
      headerTitleStyle: { ...typography.body, fontWeight: '600' },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen
      name="ReverseHome"
      component={ReverseHomeScreen}
      options={{ title: 'Voorbeeld Nadoen' }}
    />
    <Stack.Screen
      name="ReverseAnalysis"
      component={ReverseAnalysisScreen}
      options={{ title: 'Analyse' }}
    />
    <Stack.Screen
      name="ReverseShop"
      component={ReverseShopScreen}
      options={{ title: 'Winkelen' }}
    />
  </Stack.Navigator>
);
