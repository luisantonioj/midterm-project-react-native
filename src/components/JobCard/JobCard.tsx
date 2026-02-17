import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Job } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useJobs } from '../../contexts/JobContext';
import { styles } from './JobCard.styles';

interface JobCardProps {
  job: Job;
  onPress: () => void; // Open Details Modal
  onApply: () => void; // Direct Apply Action
}

export const JobCard: React.FC<JobCardProps> = ({ job, onPress, onApply }) => {
  const { colors } = useTheme();
  const { saveJob, removeJob, isJobSaved } = useJobs();
  const isSaved = isJobSaved(job.id);

  const formattedSalary = job.salaryMin && job.salaryMax
    ? `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
    : 'Salary not disclosed';

  const formattedLocation = job.locations?.join(', ') || 'Remote';
  const plainDescription = job.description?.replace(/<[^>]+>/g, '') || '';

  const tagsString = job.tags && job.tags.length > 0 
    ? job.tags.join(', ') 
    : '';

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
            {job.company}
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.saveButton, 
            isSaved && { backgroundColor: colors.primary, borderColor: colors.primary }
          ]}
          onPress={handleSave}
        >
          <Text style={[styles.saveBtnText, isSaved && { color: '#FFF' }]}>
            {isSaved ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- BADGES ROW --- */}
      <View style={styles.badgeRow}>
        {job.jobType && (
          <View style={[styles.badge, { backgroundColor: colors.inputBackground }]}>
            <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{job.jobType}</Text>
          </View>
        )}
        {job.workModel && (
          <View style={[styles.badge, { backgroundColor: colors.inputBackground }]}>
            <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{job.workModel}</Text>
          </View>
        )}
        {job.seniorityLevel && (
          <View style={[styles.badge, { backgroundColor: colors.inputBackground }]}>
            <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{job.seniorityLevel}</Text>
          </View>
        )}
      </View>

      {/* --- TAGS --- */}
      {tagsString ? (
        <Text style={[styles.tags, { color: colors.textSecondary }]} numberOfLines={2}>
          Key Skills: {tagsString}
        </Text>
      ) : null}

      {/* --- NEW FOOTER: Salary/Location Left | Apply Right --- */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.footerInfo}>
          <Text style={[styles.salaryText, { color: colors.text }]}>
            {formattedSalary}
          </Text>
          <Text style={[styles.locationText, { color: colors.textSecondary }]}>
            📍 {formattedLocation}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.applyBtn, { backgroundColor: colors.primary }]}
          onPress={onApply}
        >
          <Text style={styles.applyBtnText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};