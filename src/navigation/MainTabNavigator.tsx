import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { JobFinderScreen } from '../screens/JobFinderScreen';
import { SavedJobsScreen } from '../screens/SavedJobsScreen';
import { MainTabParamList } from './types';
import { useTheme } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="JobFinder"
        component={JobFinderScreen}
        options={{
          tabBarLabel: 'Find Jobs',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="🔍" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SavedJobs"
        component={SavedJobsScreen}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="💾" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

interface TabIconProps {
  icon: string;
  color: string;
  size: number;
}

const TabIcon: React.FC<TabIconProps> = ({ icon }) => {
  return <Text style={{ fontSize: 24 }}>{icon}</Text>;
};