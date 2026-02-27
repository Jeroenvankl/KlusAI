import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BuildHomeScreen } from '../../screens/build/BuildHomeScreen';
import { BuildPlanScreen } from '../../screens/build/BuildPlanScreen';
import { BuildStepScreen } from '../../screens/build/BuildStepScreen';
import { BuildSafetyScreen } from '../../screens/build/BuildSafetyScreen';
import { colors, typography } from '../../theme';

export type BuildStackParamList = {
  BuildHome: undefined;
  BuildPlan: { type: string };
  BuildStep: { step: { order: number; title: string; description: string } };
  BuildSafety: undefined;
};

const Stack = createNativeStackNavigator<BuildStackParamList>();

export const BuildStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
      headerTitleStyle: { ...typography.body, fontWeight: '600' },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen
      name="BuildHome"
      component={BuildHomeScreen}
      options={{ title: 'Bouw & Klushulp' }}
    />
    <Stack.Screen
      name="BuildPlan"
      component={BuildPlanScreen}
      options={{ title: 'Klusplan' }}
    />
    <Stack.Screen
      name="BuildStep"
      component={BuildStepScreen}
      options={{ title: 'Stap' }}
    />
    <Stack.Screen
      name="BuildSafety"
      component={BuildSafetyScreen}
      options={{ title: 'Veiligheid' }}
    />
  </Stack.Navigator>
);
