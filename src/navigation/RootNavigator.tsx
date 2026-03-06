import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabNavigator } from './MainTabNavigator';
import { ApplicationFormScreen } from '../screens/ApplicationFormScreen/ApplicationFormScreen';
import { JobDetailsScreen } from '../screens/JobDetailsScreen/JobDetailsScreen'; // Import new screen
import { RootStackParamList } from './types';
import { useTheme } from '../contexts/ThemeContext';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { colors, theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background, // This kills the gray flash!
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          presentation: 'modal',
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        
        <Stack.Screen 
          name="JobDetails" 
          component={JobDetailsScreen} 
          options={({ route }) => ({ 
            headerShown: true, 
            title: route.params.job.company,
            headerStyle: { 
              backgroundColor: colors.background,
              shadowColor: 'transparent', 
              elevation: 0,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerBackTitleVisible: false,
            presentation: 'card', // Use card presentation for JobDetails
          })} 
        />
        
        <Stack.Screen
          name="ApplicationForm"
          component={ApplicationFormScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};