import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useJobs } from '../../contexts/JobContext';
import { useSearch, FilterState } from '../../hooks/useSearch';
import { JobCard, ThemeToggle, Button, SearchBar } from '../../components'; 
import { Job } from '../../types';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './SavedJobsScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SavedJobsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const SavedJobsScreen: React.FC = () => {
  const navigation = useNavigation<SavedJobsScreenNavigationProp>();
  const { colors } = useTheme();
  
  const insets = useSafeAreaInsets();
  const { savedJobs, removeJob } = useJobs();

  // Reverse the array so the MOST RECENT saved jobs are at the top
  const recentSavedJobs = useMemo(() => [...savedJobs].reverse(), [savedJobs]);

  // Plug the reversed array into our search/filter hook
  const { searchQuery, setSearchQuery, filteredJobs, filters, setFilters, removeFilter } = useSearch(recentSavedJobs);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [jobToRemove, setJobToRemove] = useState<Job | null>(null);

  // Dynamic Filter Options
  const availableJobTypes = useMemo(() => Array.from(new Set(recentSavedJobs.map(j => j.jobType).filter(Boolean))) as string[], [recentSavedJobs]);
  const availableWorkModels = useMemo(() => Array.from(new Set(recentSavedJobs.map(j => j.workModel).filter(Boolean))) as string[], [recentSavedJobs]);
  const availableSeniorityLevels = useMemo(() => Array.from(new Set(recentSavedJobs.map(j => j.seniorityLevel).filter(Boolean))) as string[], [recentSavedJobs]);

  const handlePressJob = useCallback((job: Job) => {
    navigation.navigate('JobDetails', { job });
  }, [navigation]);

  const handleApply = useCallback((job: Job) => {
    navigation.navigate('ApplicationForm', { job, fromSaved: true });
  }, [navigation]);

  // 👇 1. FIX: Move renderJobItem up here and memoize it!
  const renderJobItem = useCallback(({ item }: { item: Job }) => (
    <JobCard 
      job={item} 
      onPress={() => handlePressJob(item)}
      onApply={() => handleApply(item)} 
      isSavedScreen={true} 
      onRemoveRequest={() => setJobToRemove(item)} 
    />
  ), [handlePressJob, handleApply]);

  // 👇 2. FIX: Move keyExtractor up here so it doesn't break the Rules of Hooks!
  const keyExtractor = useCallback((item: Job) => item.id, []);

  const handleConfirmRemove = () => {
    if (jobToRemove) {
      removeJob(jobToRemove.id);
    }
    setJobToRemove(null);
  };

  const toggleFilter = (category: keyof FilterState, value: string) => {
    if (category === 'sortBy') {
      setFilters(prev => ({ ...prev, sortBy: prev.sortBy === value ? 'none' : value as any }));
      return;
    }
    setFilters(prev => {
      const arr = prev[category] as string[];
      if (arr.includes(value)) {
        return { ...prev, [category]: arr.filter(item => item !== value) };
      }
      return { ...prev, [category]: [...arr, value] };
    });
  };

  const renderActiveFilters = () => {
    const activeFilters: { category: keyof FilterState, value: string, label: string }[] = [];
    
    filters.jobType.forEach(val => activeFilters.push({ category: 'jobType', value: val, label: val }));
    filters.workModel.forEach(val => activeFilters.push({ category: 'workModel', value: val, label: val }));
    filters.seniorityLevel.forEach(val => activeFilters.push({ category: 'seniorityLevel', value: val, label: val }));
    if (filters.sortBy !== 'none') {
      activeFilters.push({ category: 'sortBy', value: filters.sortBy, label: filters.sortBy === 'salary-high' ? 'Highest Salary' : 'Lowest Salary' });
    }

    if (activeFilters.length === 0) return null;

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {activeFilters.map((filter, index) => (
          <TouchableOpacity 
            key={`${filter.category}-${index}`}
            style={[styles.activeFilterBadge, { backgroundColor: colors.primary, borderColor: colors.primary }]}
            onPress={() => removeFilter(filter.category, filter.value)}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', flexShrink: 1 }}>{filter.label}</Text>
            <Ionicons name="close-circle" size={16} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyIcon, { color: colors.textSecondary }]}>📋</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {searchQuery || filters.jobType.length > 0 ? 'No matching saved jobs' : 'No saved jobs yet'}
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
        {searchQuery || filters.jobType.length > 0 ? 'Try adjusting your filters' : 'Jobs you save will appear here'}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}> 
        <Text style={[styles.title, { color: colors.text }]}>Saved Jobs</Text>
        <ThemeToggle />
      </View>

      <View style={styles.content}>
        {savedJobs.length > 0 && (
          <>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search saved jobs..."
              onFilterPress={() => setIsFilterVisible(true)}
            />
            {renderActiveFilters()}
          </>
        )}

        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} saved
        </Text>

        <FlatList
          data={filteredJobs} 
          renderItem={renderJobItem} // 👈 3. Call the extracted function
          keyExtractor={keyExtractor} // 👈 4. Call the extracted key generator
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* --- FILTER MODAL --- */}
      <Modal visible={isFilterVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              
              <Text style={[styles.filterSectionTitle, { color: colors.textSecondary }]}>Sort By</Text>
              <View style={styles.filterOptionsContainer}>
                {[
                  { id: 'salary-high', label: 'Highest Salary' },
                  { id: 'salary-low', label: 'Lowest Salary' }
                ].map(opt => (
                  <TouchableOpacity 
                    key={opt.id}
                    style={[styles.filterOptionBtn, filters.sortBy === opt.id ? { backgroundColor: colors.primary, borderColor: colors.primary } : { borderColor: colors.border }]}
                    onPress={() => toggleFilter('sortBy', opt.id)}
                  >
                    <Text style={[styles.filterOptionText, { color: filters.sortBy === opt.id ? '#fff' : colors.text }]}>{opt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {availableJobTypes.length > 0 && (
                <>
                  <Text style={[styles.filterSectionTitle, { color: colors.textSecondary }]}>Job Type</Text>
                  <View style={styles.filterOptionsContainer}>
                    {availableJobTypes.map(opt => (
                      <TouchableOpacity 
                        key={opt}
                        style={[styles.filterOptionBtn, filters.jobType.includes(opt) ? { backgroundColor: colors.primary, borderColor: colors.primary } : { borderColor: colors.border }]}
                        onPress={() => toggleFilter('jobType', opt)}
                      >
                        <Text style={[styles.filterOptionText, { color: filters.jobType.includes(opt) ? '#fff' : colors.text }]}
                          numberOfLines={1}>
                            {opt}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {availableWorkModels.length > 0 && (
                <>
                  <Text style={[styles.filterSectionTitle, { color: colors.textSecondary }]}>Work Model</Text>
                  <View style={styles.filterOptionsContainer}>
                    {availableWorkModels.map(opt => (
                      <TouchableOpacity 
                        key={opt}
                        style={[styles.filterOptionBtn, filters.workModel.includes(opt) ? { backgroundColor: colors.primary, borderColor: colors.primary } : { borderColor: colors.border }]}
                        onPress={() => toggleFilter('workModel', opt)}
                      >
                        <Text style={[styles.filterOptionText, { color: filters.workModel.includes(opt) ? '#fff' : colors.text }]}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {availableSeniorityLevels.length > 0 && (
                <>
                  <Text style={[styles.filterSectionTitle, { color: colors.textSecondary }]}>Seniority Level</Text>
                  <View style={styles.filterOptionsContainer}>
                    {availableSeniorityLevels.map(opt => (
                      <TouchableOpacity 
                        key={opt}
                        style={[styles.filterOptionBtn, filters.seniorityLevel.includes(opt) ? { backgroundColor: colors.primary, borderColor: colors.primary } : { borderColor: colors.border }]}
                        onPress={() => toggleFilter('seniorityLevel', opt)}
                      >
                        <Text style={[styles.filterOptionText, { color: filters.seniorityLevel.includes(opt) ? '#fff' : colors.text }]}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <View style={{ height: 40 }} />
            </ScrollView>
            <Button 
                title={`Show ${filteredJobs.length} ${filteredJobs.length === 1 ? 'Result' : 'Results'}`} 
                onPress={() => setIsFilterVisible(false)} 
                style={{ marginTop: 10 }} 
              />
            </View>
        </View>
      </Modal>

      {/* --- REMOVE CONFIRMATION MODAL --- */}
      <Modal visible={!!jobToRemove} animationType="fade" transparent={true}>
        <View style={styles.modalOverlayRemove}>
          <View style={[styles.modalContentRemove, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Remove Job</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Are you sure you want to remove <Text style={{ fontWeight: 'bold', color: colors.text }}>{jobToRemove?.title}</Text> at {jobToRemove?.company} from your saved jobs?
            </Text>

            <View style={styles.modalButtons}>
              <Button 
                title="Cancel" 
                variant="secondary" 
                onPress={() => setJobToRemove(null)} 
                style={styles.modalButton} 
              />
              <Button 
                title="Remove" 
                variant="danger" 
                onPress={handleConfirmRemove} 
                style={styles.modalButton} 
              />
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};