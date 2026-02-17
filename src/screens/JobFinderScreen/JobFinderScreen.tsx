import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useJobsAPI } from '../../hooks/useJobsAPI';
import { useSearch } from '../../hooks/useSearch';
import { SearchBar, JobCard, ThemeToggle } from '../../components';
import { Job } from '../../types';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './JobFinderScreen.styles';

type JobFinderScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const JobFinderScreen: React.FC = () => {
  const navigation = useNavigation<JobFinderScreenNavigationProp>();
  const { colors } = useTheme();
  const { jobs, loading, error, refreshJobs } = useJobsAPI();
  const { searchQuery, setSearchQuery, filteredJobs } = useSearch(jobs);

  const handleApply = (job: Job) => {
    navigation.navigate('ApplicationForm', { job, fromSaved: false });
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {searchQuery ? 'No jobs found matching your search' : 'No jobs available'}
      </Text>
    </View>
  );

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Job Finder</Text>
          <ThemeToggle />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      </View>
    );
  }

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
          placeholder="Search by title, company, or location"
        />

        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
        </Text>

        {loading && jobs.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading jobs...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredJobs}
            renderItem={({ item }) => (
              <JobCard job={item} onApply={handleApply} />
            )}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyComponent}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refreshJobs}
                tintColor={colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};