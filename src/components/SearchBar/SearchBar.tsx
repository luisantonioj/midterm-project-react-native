import React from 'react';
import { View, TextInput, Pressable } from 'react-native'; // Changed to Pressable
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './SearchBar.styles';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
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
        
        {/* 👇 NEW: The 'X' Clear Button appears only if there is text */}
        {value.length > 0 && (
          <Pressable 
            onPress={() => onChangeText('')}
            style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
      
      {/* Filter Button */}
      {onFilterPress && (
        <Pressable 
          style={({ pressed }) => [
            styles.filterBtn, 
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.8 }
          ]}
          onPress={onFilterPress}
        >
          <Ionicons name="options-outline" size={22} color="#fff" />
        </Pressable>
      )}
    </View>
  );
};