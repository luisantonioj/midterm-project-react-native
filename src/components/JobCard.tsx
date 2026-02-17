import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Job } from '../types';
import { Button } from './Button';
import { useTheme } from '../contexts/ThemeContext';
import { useJobs } from '../contexts/JobContext';

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  showRemove?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply, showRemove = false }) => {
  const { colors } = useTheme();
  const { saveJob, removeJob, isJobSaved } = useJobs();
  const isSaved = isJobSaved(job.id);

  const handleSaveToggle = () => {
    if (isSaved) {
      removeJob(job.id);
    } else {
      saveJob(job);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>{job.title}</Text>
      <Text style={[styles.company, { color: colors.textSecondary }]}>{job.company}</Text>
      
      <View style={styles.detailsContainer}>
        {job.salary && (
          <Text style={[styles.detail, { color: colors.textSecondary }]}>
            💰 {job.salary}
          </Text>
        )}
        {job.location && (
          <Text style={[styles.detail, { color: colors.textSecondary }]}>
            📍 {job.location}
          </Text>
        )}
        {job.type && (
          <Text style={[styles.detail, { color: colors.textSecondary }]}>
            ⏰ {job.type}
          </Text>
        )}
      </View>

      {job.description && (
        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={3}
        >
          {job.description}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Apply"
          onPress={() => onApply(job)}
          style={styles.button}
        />
        
        {showRemove ? (
          <Button
            title="Remove"
            onPress={handleSaveToggle}
            variant="danger"
            style={styles.button}
          />
        ) : (
          <Button
            title={isSaved ? 'Saved' : 'Save Job'}
            onPress={handleSaveToggle}
            variant={isSaved ? 'success' : 'secondary'}
            disabled={isSaved}
            style={styles.button}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  company: {
    fontSize: 16,
    marginBottom: 12,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});