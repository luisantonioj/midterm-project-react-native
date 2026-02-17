import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useJobs } from '../../contexts/JobContext';
import { Button } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './JobDetailsScreen.styles';

// Helper to clean up the HTML from the API
const formatDescription = (html: string) => {
  if (!html) return 'No description available.';
  return html
    .replace(/<h3[^>]*>/g, '\n\n● ') // Replace h3 with bullets
    .replace(/<\/h3>/g, '\n')
    .replace(/<li[^>]*>/g, '\n  - ') // Replace li with dashes
    .replace(/<[^>]+>/g, '') // Remove all other tags
    .replace(/&amp;/g, '&')
    .trim();
};

export const JobDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'JobDetails'>>();
  const { job } = route.params;
  const { saveJob, removeJob, isJobSaved } = useJobs();

  const isSaved = isJobSaved(job.id);

  const handleSaveToggle = () => {
    if (isSaved) removeJob(job.id);
    else saveJob(job);
  };

  const handleApply = () => {
    navigation.navigate('ApplicationForm', { job, fromSaved: false });
  };

  const formattedSalary = job.salaryMin && job.salaryMax
    ? `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
    : 'Salary not disclosed';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Image 
            source={{ uri: job.companyLogo || 'https://via.placeholder.com/64' }} 
            style={styles.logo} 
          />
          <View style={styles.headerInfo}>
            <Text style={[styles.title, { color: colors.text }]}>{job.title}</Text>
            <Text style={[styles.company, { color: colors.primary }]}>{job.company}</Text>
            <Text style={[styles.location, { color: colors.textSecondary }]}>📍 {job.locations}</Text>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.badgesRow}>
          {[job.jobType, job.workModel, job.seniorityLevel, job.mainCategory].filter(Boolean).map((badge, index) => (
            <View key={index} style={[styles.badge, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{badge}</Text>
            </View>
          ))}
        </View>

        {/* Salary Section */}
        <View style={[styles.salaryCard, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          <Text style={{ fontSize: 20 }}>💰</Text>
          <Text style={[styles.salaryText, { color: colors.text }]}>{formattedSalary}</Text>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About the Role</Text>
          <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
            {formatDescription(job.description || '')}
          </Text>
        </View>

        {/* Tags Section */}
        {job.tags && job.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tags</Text>
            <View style={styles.tagsContainer}>
              {job.tags.map((tag, index) => (
                <Text key={index} style={[styles.tag, { backgroundColor: colors.card, color: colors.primary }]}>
                  #{tag}
                </Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Footer */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Button 
          title={isSaved ? "Saved" : "Save"} 
          onPress={handleSaveToggle}
          variant={isSaved ? "success" : "secondary"}
          style={styles.saveButton}
        />
        <Button 
          title="Apply Now" 
          onPress={handleApply} 
          style={styles.applyButton}
        />
      </View>
    </View>
  );
};