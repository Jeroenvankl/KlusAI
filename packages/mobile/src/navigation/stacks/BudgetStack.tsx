import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BudgetHomeScreen } from '../../screens/budget/BudgetHomeScreen';
import { BudgetCalculatorScreen } from '../../screens/budget/BudgetCalculatorScreen';
import { BudgetEcoScreen } from '../../screens/budget/BudgetEcoScreen';
import { colors, typography } from '../../theme';

export type BudgetStackParamList = {
  BudgetHome: undefined;
  BudgetCalculator: { projectId?: string };
  BudgetEco: undefined;
};

const Stack = createNativeStackNavigator<BudgetStackParamList>();

export const BudgetStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
      headerTitleStyle: { ...typography.body, fontWeight: '600' },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen
      name="BudgetHome"
      component={BudgetHomeScreen}
      options={{ title: 'Budget & Duurzaamheid' }}
    />
    <Stack.Screen
      name="BudgetCalculator"
      component={BudgetCalculatorScreen}
      options={{ title: 'Calculator' }}
    />
    <Stack.Screen
      name="BudgetEco"
      component={BudgetEcoScreen}
      options={{ title: 'Duurzaam klussen' }}
    />
  </Stack.Navigator>
);
