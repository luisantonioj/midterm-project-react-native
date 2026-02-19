import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { Job } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useJobs } from '../../contexts/JobContext';
import { styles } from './JobCard.styles';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onApply: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onPress, onApply }) => {
  const { colors } = useTheme();
  const { saveJob, removeJob, isJobSaved } = useJobs();
  const isSaved = isJobSaved(job.id);

  const formattedSalary = job.salaryMin && job.salaryMax
    ? `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
    : 'Salary not disclosed';

  const formattedLocation = job.locations?.join(', ') || 'Remote';
  
  const tagsString = job.tags && job.tags.length > 0 
    ? job.tags.join(', ') 
    : '';

  const handleSave = () => {
    if (isSaved) removeJob(job.id);
    else saveJob(job);
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card, 
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && { opacity: 0.9 } // Added fade effect for the card
      ]}
      onPress={onPress}
    >
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
        <Pressable 
          style={({ pressed }) => [styles.saveIconBtn, pressed && { opacity: 0.6 }]}
          onPress={handleSave}
        >
          <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color={isSaved ? colors.primary : colors.textSecondary} />
        </Pressable>
      </View>

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

      {tagsString ? (
        <Text style={[styles.tags, { color: colors.textSecondary }]} numberOfLines={2}>
          Key Skills: {tagsString}
        </Text>
      ) : null}

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.footerInfo}>
          <Text style={[styles.salaryText, { color: colors.text }]}>
            {formattedSalary}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} style={{ marginRight: 2 }} />
            <Text style={[styles.locationText, { color: colors.textSecondary }]}>
              {formattedLocation}
            </Text>
          </View>
        </View>

        <Pressable 
          style={({ pressed }) => [
            styles.applyBtn, 
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.8 } // Added fade effect for the apply button
          ]}
          onPress={onApply}
        >
          <Text style={styles.applyBtnText}>Apply Now</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};