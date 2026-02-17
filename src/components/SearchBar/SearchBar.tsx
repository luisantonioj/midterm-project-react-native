import React from 'react';
import { View, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './SearchBar.styles';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search jobs...',
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};