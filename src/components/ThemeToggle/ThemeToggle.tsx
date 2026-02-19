import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './ThemeToggle.styles';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      {/* Replaced emoji with Icon */}
      <Ionicons 
        name={theme === 'light' ? 'moon' : 'sunny'} 
        size={20} 
        color={colors.text} 
      />
    </TouchableOpacity>
  );
};