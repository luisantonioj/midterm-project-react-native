import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Modal, // Import Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useJobsAPI } from '../../hooks/useJobsAPI';
import { useSearch, FilterState } from '../../hooks/useSearch';
import { SearchBar, JobCard, ThemeToggle, Button } from '../../components';
import { Job } from '../../types';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './JobFinderScreen.styles';

type JobFinderScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const JobFinderScreen: React.FC = () => {
  const navigation = useNavigation<JobFinderScreenNavigationProp>();
  const { colors } = useTheme();
  const { jobs, loading, error, refreshJobs } = useJobsAPI();
  
  // Destructure the new filter hooks
  const { searchQuery, setSearchQuery, filteredJobs, filters, setFilters, removeFilter } = useSearch(jobs);

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // --- Extract Unique Categories for the Filter Modal ---
  const availableJobTypes = useMemo(() => Array.from(new Set(jobs.map(j => j.jobType).filter(Boolean))) as string[], [jobs]);
  const availableWorkModels = useMemo(() => Array.from(new Set(jobs.map(j => j.workModel).filter(Boolean))) as string[], [jobs]);
  const availableSeniorityLevels = useMemo(() => Array.from(new Set(jobs.map(j => j.seniorityLevel).filter(Boolean))) as string[], [jobs]);

  const handlePressJob = (job: Job) => {
    navigation.navigate('JobDetails', { job });
  };

  const handleApply = (job: Job) => {
    navigation.navigate('ApplicationForm', { job, fromSaved: false });
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

  // --- Renders active badges ---
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
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {searchQuery || filters.jobType.length > 0 ? 'No jobs found matching your filters' : 'No jobs available'}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Job Finder</Text>
        <ThemeToggle />
      </View>

      <View style={styles.content}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search title, company, or location"
          onFilterPress={() => setIsFilterVisible(true)}
        />

        {renderActiveFilters()}

        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
        </Text>

        {loading && jobs.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading jobs...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredJobs}
            renderItem={({ item }) => (
              <JobCard 
                job={item} 
                onPress={() => handlePressJob(item)} 
                onApply={() => handleApply(item)} 
              />
            )}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyComponent}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshJobs} tintColor={colors.primary} />}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}      
            maxToRenderPerBatch={5}     
            windowSize={5}             
            removeClippedSubviews={true}
          />
        )}
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
              
              {/* Sort Options */}
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

              {/* Job Types */}
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

              {/* Work Models */}
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

              {/* Seniority Levels */}
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

    </View>
  );
};