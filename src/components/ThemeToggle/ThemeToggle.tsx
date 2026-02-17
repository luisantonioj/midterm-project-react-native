import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
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
      <Text style={styles.icon}>{theme === 'light' ? '🌙' : '☀️'}</Text>
    </TouchableOpacity>
  );
};