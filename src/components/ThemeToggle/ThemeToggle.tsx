import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './ThemeToggle.styles';
import { Pressable } from 'react-native';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button, 
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && { opacity: 0.7 }
      ]}
      onPress={toggleTheme}
    >
      <Ionicons name={theme === 'light' ? 'moon' : 'sunny'} size={20} color={colors.text} />
    </Pressable>
  );
};