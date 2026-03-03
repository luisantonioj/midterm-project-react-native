import React, { useState } from 'react';
import { View, Text, FlatList, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useJobs } from '../../contexts/JobContext';
import { JobCard, ThemeToggle, Button } from '../../components';
import { Job } from '../../types';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './SavedJobsScreen.styles';

type SavedJobsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const SavedJobsScreen: React.FC = () => {
  const navigation = useNavigation<SavedJobsScreenNavigationProp>();
  const { colors } = useTheme();
  const { savedJobs, removeJob } = useJobs();
  const [jobToRemove, setJobToRemove] = useState<Job | null>(null);

  const handlePressJob = (job: Job) => {
    navigation.navigate('JobDetails', { job });
  };

  const handleApply = (job: Job) => {
    navigation.navigate('ApplicationForm', { job, fromSaved: true });
  };

  const handleConfirmRemove = () => {
    if (jobToRemove) {
      removeJob(jobToRemove.id);
    }
    setJobToRemove(null);
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
            <JobCard 
              job={item} 
              onPress={() => handlePressJob(item)} // Pass the press handler here
              onApply={() => handleApply(item)} 
              isSavedScreen={true} 
              onRemoveRequest={() => setJobToRemove(item)} 
            />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {/* --- REMOVE CONFIRMATION MODAL --- */}
      <Modal visible={!!jobToRemove} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
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