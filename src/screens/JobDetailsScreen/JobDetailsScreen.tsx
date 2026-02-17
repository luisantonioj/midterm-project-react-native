import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useJobs } from '../../contexts/JobContext';
import { Button } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './JobDetailsScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 1. Helper to clean HTML tags from a string
const cleanHtml = (html: string) => {
  if (!html) return '';
  return html
    .replace(/<li[^>]*>/g, '\n• ')      // Convert <li> to bullets
    .replace(/<br\s*\/?>/g, '\n')       // Convert <br> to newlines
    .replace(/<[^>]+>/g, '')            // Remove all other HTML tags
    .replace(/&amp;/g, '&')             // Fix common entities
    .replace(/&nbsp;/g, ' ')
    .trim();
};

// 2. Helper to extract specific sections based on the headers
const getSectionContent = (html: string, section: 'description' | 'requirements' | 'benefits') => {
  if (!html) return 'No information available.';

  // Regex patterns for each section
  const descRegex = /<h3[^>]*>.*?Description.*?<\/h3>([\s\S]*?)(?=<h3|$)/i;
  const reqRegex = /<h3[^>]*>.*?Requirements.*?<\/h3>([\s\S]*?)(?=<h3|$)/i;
  const benRegex = /<h3[^>]*>.*?Benefits.*?<\/h3>([\s\S]*?)(?=<h3|$)/i;

  if (section === 'description') {
    const match = html.match(descRegex);
    if (match && match[1]) return cleanHtml(match[1]);
    
    // Fallback: take everything before "Requirements" if no header found
    const splitByReq = html.split(/<h3[^>]*>.*?Requirements/i);
    return cleanHtml(splitByReq[0]);
  }

  if (section === 'requirements') {
    const match = html.match(reqRegex);
    if (match && match[1]) return cleanHtml(match[1]);
    return 'No specific requirements listed.';
  }

  if (section === 'benefits') {
    const match = html.match(benRegex);
    if (match && match[1]) return cleanHtml(match[1]);
    return 'No specific benefits listed.';
  }

  return '';
};

export const JobDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'JobDetails'>>();
  const { job } = route.params;
  const { saveJob, removeJob, isJobSaved } = useJobs();

  const [activeTab, setActiveTab] = useState<'description' | 'requirements' | 'benefits'>('description');

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
    : job.salary || 'Salary not disclosed';

  const displayedContent = getSectionContent(job.description || '', activeTab);

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: job.companyLogo || 'https://via.placeholder.com/80' }} 
            style={styles.logo} 
          />
        </View>

        {/* Company Name */}
        <Text style={[styles.title, { color: colors.text }]}>
          {job.title}
        </Text>

        {/* Salary */}
        <Text style={[styles.salary, { color: colors.success }]}>
          {formattedSalary}
        </Text>

        {/* Location */}
        <Text style={[styles.locations, { color: colors.text }]}>
          {job.locations || 'Location not specified'}
        </Text>

        {/* Badges */}
        <View style={styles.badgesRow}>
          {[job.jobType, job.workModel, job.seniorityLevel].filter(Boolean).map((badge, index) => (
            <View key={index} style={[styles.badge, { backgroundColor: colors.inputBackground }]}>
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{badge}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'description' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('description')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'description' ? colors.primary : colors.textSecondary }
            ]}>
              Description
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'requirements' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('requirements')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'requirements' ? colors.primary : colors.textSecondary }
            ]}>
              Requirements
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'benefits' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('benefits')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'benefits' ? colors.primary : colors.textSecondary }
            ]}>
              Benefits
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area (Dynamic) */}
        <View style={styles.contentArea}>
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
            {displayedContent}
          </Text>
        </View>

        {/* Key Skills */}
        {job.tags && job.tags.length > 0 && (
          <View style={styles.tagsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Skills</Text>
            <View style={styles.tagsContainer}>
              {job.tags.map((tag, index) => (
                <Text key={index} style={[styles.tag, { 
                  backgroundColor: colors.card, 
                  color: colors.primary,
                  borderColor: colors.border
                }]}>
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 5 }]}>
        <Button 
          title={isSaved ? "Saved" : "Save Job"} 
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