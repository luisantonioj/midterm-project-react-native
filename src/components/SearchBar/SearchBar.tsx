import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './SearchBar.styles';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void; // New Prop
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search jobs...',
  onFilterPress,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer,
        {
          backgroundColor: colors.inputBackground,
          borderColor: colors.border,
        }
      ]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      
      {/* Filter Button */}
      {onFilterPress && (
        <TouchableOpacity 
          style={[styles.filterBtn, { backgroundColor: colors.primary }]}
          onPress={onFilterPress}
        >
          <Ionicons name="options-outline" size={22} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};