import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { Button, Input } from '../../components';
import { validateName, validateEmail, validateContactNumber } from '../../utils/validation';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './ApplicationFormScreen.styles';

type ApplicationFormRouteProp = RouteProp<RootStackParamList, 'ApplicationForm'>;
type ApplicationFormNavigationProp = StackNavigationProp<RootStackParamList, 'ApplicationForm'>;

export const ApplicationFormScreen: React.FC = () => {
  const navigation = useNavigation<ApplicationFormNavigationProp>();
  const route = useRoute<ApplicationFormRouteProp>();
  const { colors } = useTheme();
  
  const { job, fromSaved } = route.params;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    whyHireYou: '',
  });

  // Track which fields the user has interacted with
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Real-time error evaluation ---
  const nameError = validateName(formData.name);
  const emailError = validateEmail(formData.email);
  const contactError = validateContactNumber(formData.contactNumber);

  // Form is valid only if required fields have NO errors
  const isFormValid = !nameError && !emailError && !contactError;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Instantly mark the field as "touched" the moment they start typing
    // This forces the UI to evaluate and show the error message immediately.
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  // Triggers when a user clicks into an input and then clicks away
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = () => {
    // Touch all required fields just in case (e.g. keyboard submit)
    setTouched({ name: true, email: true, contactNumber: true });

    if (!isFormValid) return;

    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);

      Alert.alert(
        'Success! 🎉',
        `Application submitted successfully for ${job.title} at ${job.company}!`,
        [
          {
            text: 'Okay',
            onPress: () => {
              if (fromSaved) {
                navigation.navigate('MainTabs');
              } else {
                navigation.goBack();
              }
            },
          },
        ],
        { cancelable: false }
      );
    }, 1000);
  };

  const formattedSalary = job.salaryMin && job.salaryMax
    ? `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
    : job.salary || 'Salary not disclosed';

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Apply for Job</Text>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          
          {/* Top Row: Logo, Title, Company */}
          <View style={styles.summaryHeader}>
            <Image 
              source={{ uri: job.companyLogo || 'https://via.placeholder.com/60' }} 
              style={styles.logo} 
            />
            <View style={styles.headerTextContainer}>
              <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={2}>
                {job.title}
              </Text>
              <Text style={[styles.company, { color: colors.textSecondary }]}>
                {job.company}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Details Grid with Icons */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.text }]}>{formattedSalary}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.text }]} numberOfLines={1}>
                {job.locations?.join(', ') || 'Remote'}
              </Text>
            </View>

            {job.jobType && (
              <View style={styles.detailItem}>
                <Ionicons name="briefcase-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.text }]}>{job.jobType}</Text>
              </View>
            )}

            {job.workModel && (
              <View style={styles.detailItem}>
                <Ionicons name="laptop-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.text }]}>{job.workModel}</Text>
              </View>
            )}

            {job.seniorityLevel && (
              <View style={styles.detailItem}>
                <Ionicons name="trending-up-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.text }]}>{job.seniorityLevel}</Text>
              </View>
            )}
          </View>
        </View>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name *"
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            onBlur={() => handleBlur('name')} // Check validity on blur
            error={touched.name ? nameError : ''} // Only show error if touched
          />

          <Input
            label="Email Address *"
            placeholder="your.email@example.com"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            onBlur={() => handleBlur('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            error={touched.email ? emailError : ''}
          />

          <Input
            label="Contact Number *"
            placeholder="09123456789"
            value={formData.contactNumber}
            onChangeText={(value) => handleInputChange('contactNumber', value)}
            onBlur={() => handleBlur('contactNumber')}
            keyboardType="phone-pad"
            error={touched.contactNumber ? contactError : ''}
          />

          <Input
            label="Why should we hire you? (Optional)"
            placeholder="Tell us about your skills and experience"
            value={formData.whyHireYou}
            onChangeText={(value) => handleInputChange('whyHireYou', value)}
            multiline
            numberOfLines={6}
            style={styles.textArea}
            // No error or onBlur props needed here since it's completely optional
          />

          <View style={styles.buttonContainer}>
            <Button
              title={isSubmitting ? 'Submitting...' : 'Submit Application'}
              onPress={handleSubmit}
              disabled={!isFormValid || isSubmitting} // Disables the button dynamically
            />
            
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="secondary"
              style={styles.cancelButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};