import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

// 3. Helper to format tags conditionally
const formatTag = (tag: string) => {
  if (!tag) return '';
  // Only format if the tag is completely lowercase
  if (tag === tag.toLowerCase()) {
    return tag
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  // Otherwise, leave it alone (preserves "iOS", "NodeJS", "UI/UX", etc.)
  return tag;
};

export const JobDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'JobDetails'>>();
  const { job } = route.params;
  const { saveJob, removeJob, isJobSaved, hasAppliedToJob } = useJobs();

  const [activeTab, setActiveTab] = useState<'description' | 'requirements' | 'benefits'>('description');

  const isSaved = isJobSaved(job.id);
  const hasApplied = hasAppliedToJob(job.id);

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
        <Text style={[styles.salary, { color: colors.primary }]}>
          {formattedSalary}
        </Text>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} style={styles.locationIcon} />
          <Text style={[styles.locations, { color: colors.textSecondary }]}>
            {job.locations?.join(', ') || 'Location not specified'}
          </Text>
        </View>

        {/* Badges */}
        <View style={styles.badgesRow}>
          {job.jobType && (
            <View style={[styles.badge, { backgroundColor: colors.inputBackground }]}>
              <Ionicons name="briefcase-outline" size={14} color={colors.textSecondary} style={styles.badgeIcon} />
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{job.jobType}</Text>
            </View>
          )}
          {job.workModel && (
            <View style={[styles.badge, { backgroundColor: colors.inputBackground }]}>
              <Ionicons name="laptop-outline" size={14} color={colors.textSecondary} style={styles.badgeIcon} />
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{job.workModel}</Text>
            </View>
          )}
          {job.seniorityLevel && (
            <View style={[styles.badge, { backgroundColor: colors.inputBackground }]}>
              <Ionicons name="trending-up-outline" size={14} color={colors.textSecondary} style={styles.badgeIcon} />
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{job.seniorityLevel}</Text>
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
          <Pressable 
            style={({ pressed }) => [
              styles.tabButton, 
              activeTab === 'description' && { borderBottomColor: colors.primary },
              pressed && { opacity: 0.6 }
            ]}
            onPress={() => setActiveTab('description')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'description' ? colors.primary : colors.textSecondary }
            ]}>
              Description
            </Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.tabButton, 
              activeTab === 'requirements' && { borderBottomColor: colors.primary },
              pressed && { opacity: 0.6 }
            ]}
            onPress={() => setActiveTab('requirements')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'requirements' ? colors.primary : colors.textSecondary }
            ]}>
              Requirements
            </Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.tabButton, 
              activeTab === 'benefits' && { borderBottomColor: colors.primary },
              pressed && { opacity: 0.6 } 
            ]}
            onPress={() => setActiveTab('benefits')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'benefits' ? colors.primary : colors.textSecondary }
            ]}>
              Benefits
            </Text>
          </Pressable>
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
                <View 
                  key={index} 
                  style={[styles.tag, { 
                    backgroundColor: colors.card, 
                    borderColor: colors.border
                  }]}
                >
                  <Text 
                    style={[styles.tagText, { color: colors.primary }]}
                    numberOfLines={1}
                  >
                    {formatTag(tag)}
                  </Text>
                </View>
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
          iconName={isSaved ? "bookmark" : "bookmark-outline"}
        />
        <Button 
          title={hasApplied ? "Applied" : "Apply Now"} 
          onPress={handleApply} 
          style={styles.applyButton}
          disabled={hasApplied} // Disables the button
          variant={hasApplied ? "success" : "primary"} // Turns green
          iconName={hasApplied ? "checkmark-circle" : "paper-plane-outline"} // Swaps the icon
        />
      </View>
    </View>
  );
};