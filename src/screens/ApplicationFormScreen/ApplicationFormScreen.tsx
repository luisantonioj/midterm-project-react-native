import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
  Modal,
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

  // Modal States
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  // --- Real-time error evaluation ---
  const nameError = validateName(formData.name);
  const emailError = validateEmail(formData.email);
  const contactError = validateContactNumber(formData.contactNumber);

  // Form is valid only if required fields have NO errors
  const isFormValid = !nameError && !emailError && !contactError;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // STEP 1: Open the confirmation modal if valid
  const handleInitiateSubmit = () => {
    setTouched({ name: true, email: true, contactNumber: true });
    if (!isFormValid) return;
    setIsConfirmVisible(true);
  };

  // STEP 2: Process the final submission
  const handleConfirmSubmit = () => {
    setIsConfirmVisible(false);
    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessVisible(true);
    }, 1500);
  };

  // STEP 3: Close success modal and navigate away
  const handleSuccessClose = () => {
    setIsSuccessVisible(false);
    setFormData({ name: '', email: '', contactNumber: '', whyHireYou: '' });
    if (fromSaved) {
      navigation.navigate('MainTabs');
    } else {
      navigation.goBack();
    }
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
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.text }]}>Apply for Job</Text>
            <Pressable 
              onPress={() => navigation.goBack()} 
              style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
            >
              <Ionicons name="close-circle" size={28} color={colors.textSecondary} />
            </Pressable>
          </View>

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
            onBlur={() => handleBlur('name')}
            error={touched.name ? nameError : ''} 
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
          />

          <View style={styles.buttonContainer}>
            <Button
              title={isSubmitting ? 'Processing...' : 'Submit Application'}
              onPress={handleInitiateSubmit} 
              disabled={!isFormValid || isSubmitting} 
            />
          </View>
        </View>
      </ScrollView>

      {/* --- CONFIRMATION MODAL --- */}
      <Modal visible={isConfirmVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Review Application</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Please confirm your details before sending to {job.company}.
            </Text>

            <View style={[styles.reviewBox, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Role</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]} numberOfLines={1}>{job.title}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Name</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]} numberOfLines={1}>{formData.name}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Email</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]} numberOfLines={1}>{formData.email}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>Contact</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]} numberOfLines={1}>{formData.contactNumber}</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Button title="Cancel" variant="secondary" onPress={() => setIsConfirmVisible(false)} style={styles.modalButton} />
              <Button title="Confirm" onPress={handleConfirmSubmit} style={styles.modalButton} />
            </View>
          </View>
        </View>
      </Modal>

      {/* --- SUCCESS MODAL --- */}
      <Modal visible={isSuccessVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, alignItems: 'center' }]}>
            <View style={styles.successIconBox}>
              <Ionicons name="checkmark-circle" size={80} color={colors.success} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text, textAlign: 'center' }]}>Application Sent!</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary, textAlign: 'center', marginBottom: 24 }]}>
              Your application for <Text style={{ fontWeight: 'bold' }}>{job.title}</Text> at {job.company} has been successfully submitted and is now being processed.
            </Text>
            <Button title="Awesome!" onPress={handleSuccessClose} style={{ width: '100%' }} />
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
};