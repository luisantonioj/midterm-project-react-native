import React from 'react';
import { TextInput, Text, View, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './Input.styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            color: colors.text,
            borderColor: error ? colors.error : colors.border,
          },
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};