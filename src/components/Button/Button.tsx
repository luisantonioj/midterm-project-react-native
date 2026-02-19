import React from 'react';
import { Pressable, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './Button.styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'secondary':
        return colors.card;
      case 'danger':
        return colors.error;
      case 'success':
        return colors.success;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    return variant === 'secondary' ? colors.text : '#FFFFFF';
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: getBackgroundColor() },
        style,
        pressed && { opacity: 0.7 } 
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
};