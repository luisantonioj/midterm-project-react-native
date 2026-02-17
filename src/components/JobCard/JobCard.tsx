import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Job } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useJobs } from '../../contexts/JobContext';
import { styles } from './JobCard.styles';

interface JobCardProps {
  job: Job;
  onPress: () => void; // Used to open the modal later
}

export const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
  const { colors } = useTheme();
  const { saveJob, removeJob, isJobSaved } = useJobs();
  const isSaved = isJobSaved(job.id);

  // Helper to format salary
  const formattedSalary = job.salaryMin && job.salaryMax
    ? `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
    : 'Salary not disclosed';

  // Helper to format location
  const formattedLocation = job.locations?.join(', ') || 'Remote';

  // Helper to strip HTML tags for the preview
  const plainDescription = job.description?.replace(/<[^>]+>/g, '') || '';

  const handleSave = () => {
    if (isSaved) removeJob(job.id);
    else saveJob(job);
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* --- HEADER: Logo, Title, Save Button --- */}
      <View style={styles.header}>
        <Image 
          source={{ uri: job.companyLogo || 'https://via.placeholder.com/50' }} 
          style={styles.logo} 
        />
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {job.title}
          </Text>
          <Text style={[styles.company, { color: colors.textSecondary }]}>
            {job.company} • {job.mainCategory}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.saveButton, isSaved && { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveText, isSaved && { color: '#FFF' }]}>
            {isSaved ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- BADGES ROW: Work Model, Job Type, Seniority --- */}
      <View style={styles.badgeRow}>
        {job.workModel && (
          <View style={[styles.badge, { backgroundColor: colors.inputBackground }]}>
            <Text style={[styles.badgeText, { color: colors.textSecondary }]}>🏠 {job.workModel}</Text>
          </View>
        )}
        {job.jobType && (
          <View style={[styles.badge, { backgroundColor: colors.inputBackground }]}>
            <Text style={[styles.badgeText, { color: colors.textSecondary }]}>💼 {job.jobType}</Text>
          </View>
        )}
        {job.seniorityLevel && (
          <View style={[styles.badge, { backgroundColor: colors.inputBackground }]}>
            <Text style={[styles.badgeText, { color: colors.textSecondary }]}>⭐ {job.seniorityLevel}</Text>
          </View>
        )}
      </View>

      {/* --- INFO ROW: Salary & Location --- */}
      <View style={styles.infoRow}>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>📍 {formattedLocation}</Text>
        <Text style={[styles.infoText, { color: colors.success }]}>💰 {formattedSalary}</Text>
      </View>

      {/* --- DESCRIPTION PREVIEW --- */}
      <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={3}>
        {plainDescription}
      </Text>

      {/* --- TAGS FOOTER --- */}
      <View style={styles.tagsContainer}>
        {job.tags?.slice(0, 3).map((tag, index) => (
          <Text key={index} style={[styles.tag, { color: colors.primary, borderColor: colors.primary }]}>
            #{tag}
          </Text>
        ))}
        {(job.tags?.length || 0) > 3 && (
          <Text style={[styles.tag, { color: colors.textSecondary, borderColor: colors.border }]}>
            +{job.tags!.length - 3} more
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};