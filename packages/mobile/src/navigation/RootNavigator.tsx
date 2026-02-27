import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { PaintStack } from './stacks/PaintStack';
import { DesignStack } from './stacks/DesignStack';
import { SpaceStack } from './stacks/SpaceStack';
import { BudgetStack } from './stacks/BudgetStack';
import { BuildStack } from './stacks/BuildStack';
import { ReverseStack } from './stacks/ReverseStack';

export type RootStackParamList = {
  Dashboard: undefined;
  Paint: undefined;
  Design: undefined;
  Space: undefined;
  Budget: undefined;
  Build: undefined;
  Reverse: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => (
  <Stack.Navigator
    initialRouteName="Dashboard"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="Paint" component={PaintStack} />
    <Stack.Screen name="Design" component={DesignStack} />
    <Stack.Screen name="Space" component={SpaceStack} />
    <Stack.Screen name="Budget" component={BudgetStack} />
    <Stack.Screen name="Build" component={BuildStack} />
    <Stack.Screen name="Reverse" component={ReverseStack} />
  </Stack.Navigator>
);
