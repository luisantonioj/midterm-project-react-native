import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { JobProvider } from './src/contexts/JobContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <JobProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </JobProvider>
    </ThemeProvider>
  );
}