import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { useJobs } from '../contexts/JobContext';
import { JobCard, ThemeToggle } from '../components';
import { Job } from '../types';
import { RootStackParamList } from '../navigation/types';

type SavedJobsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const SavedJobsScreen: React.FC = () => {
  const navigation = useNavigation<SavedJobsScreenNavigationProp>();
  const { colors } = useTheme();
  const { savedJobs } = useJobs();

  const handleApply = (job: Job) => {
    navigation.navigate('ApplicationForm', { job, fromSaved: true });
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyIcon, { color: colors.textSecondary }]}>📋</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        No saved jobs yet
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
        Jobs you save will appear here
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Saved Jobs</Text>
        <ThemeToggle />
      </View>

      <View style={styles.content}>
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
        </Text>

        <FlatList
          data={savedJobs}
          renderItem={({ item }) => (
            <JobCard job={item} onApply={handleApply} showRemove />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  count: {
    fontSize: 14,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
});