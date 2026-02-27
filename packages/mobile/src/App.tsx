import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './navigation';
import { colors } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const linking = {
  prefixes: ['klusai://'],
  config: {
    screens: {
      Dashboard: '',
      Paint: {
        path: 'paint',
        screens: {
          PaintHome: '',
          PaintPreview: 'preview',
          PaintCompare: 'compare',
          PaintCart: 'cart',
        },
      },
      Design: {
        path: 'design',
        screens: {
          DesignHome: '',
          DesignResult: 'result',
          DesignDetail: 'detail',
        },
      },
      Space: {
        path: 'space',
        screens: {
          SpaceHome: '',
          SpaceScan: 'scan',
          SpaceModel: 'model',
          SpaceFurniture: 'furniture',
        },
      },
      Budget: {
        path: 'budget',
        screens: {
          BudgetHome: '',
          BudgetCalculator: 'calculator',
          BudgetEco: 'eco',
        },
      },
      Build: {
        path: 'build',
        screens: {
          BuildHome: '',
          BuildPlan: 'plan',
          BuildStep: 'step',
          BuildSafety: 'safety',
        },
      },
      Reverse: {
        path: 'reverse',
        screens: {
          ReverseHome: '',
          ReverseAnalysis: 'analysis',
          ReverseShop: 'shop',
        },
      },
    },
  },
};

const App = () => {
  const content = (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer linking={linking}>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );

  // On web, center the app in a phone-sized frame
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webWrapper}>
        <View style={styles.webPhone}>{content}</View>
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  webWrapper: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
  },
  webPhone: {
    width: 430,
    height: '100%',
    maxHeight: 932,
    overflow: 'hidden',
    borderRadius: 0,
    backgroundColor: '#F5F6FA',
  },
});

export default App;
