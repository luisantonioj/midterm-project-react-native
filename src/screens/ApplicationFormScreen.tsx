import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Input } from '../components';
import { validateApplicationForm } from '../utils/validation';
import { RootStackParamList } from '../navigation/types';

type ApplicationFormRouteProp = RouteProp<RootStackParamList, 'ApplicationForm'>;
type ApplicationFormNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ApplicationForm'
>;

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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = () => {
    // Validate form
    const validationErrors = validateApplicationForm(
      formData.name,
      formData.email,
      formData.contactNumber,
      formData.whyHireYou
    );

    if (validationErrors.length > 0) {
      const errorMap: { [key: string]: string } = {};
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      return;
    }

    // Submit application
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);

      // Show success message
      const message = `Application submitted successfully for ${job.title} at ${job.company}!`;
      
      Alert.alert(
        'Success! 🎉',
        message,
        [
          {
            text: 'Okay',
            onPress: () => {
              // Clear form
              setFormData({
                name: '',
                email: '',
                contactNumber: '',
                whyHireYou: '',
              });

              // Navigate based on where the user came from
              if (fromSaved) {
                navigation.navigate('JobFinder');
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
          <Text style={[styles.jobTitle, { color: colors.textSecondary }]}>
            {job.title}
          </Text>
          <Text style={[styles.company, { color: colors.textSecondary }]}>
            {job.company}
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name *"
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            error={errors.name}
          />

          <Input
            label="Email Address *"
            placeholder="your.email@example.com"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Input
            label="Contact Number *"
            placeholder="1234567890"
            value={formData.contactNumber}
            onChangeText={(value) => handleInputChange('contactNumber', value)}
            keyboardType="phone-pad"
            error={errors.contactNumber}
          />

          <Input
            label="Why should we hire you? *"
            placeholder="Tell us about your skills and experience (minimum 20 characters)"
            value={formData.whyHireYou}
            onChangeText={(value) => handleInputChange('whyHireYou', value)}
            multiline
            numberOfLines={6}
            style={styles.textArea}
            error={errors.whyHireYou}
          />

          <View style={styles.buttonContainer}>
            <Button
              title={isSubmitting ? 'Submitting...' : 'Submit Application'}
              onPress={handleSubmit}
              disabled={isSubmitting}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  company: {
    fontSize: 16,
  },
  form: {
    flex: 1,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 12,
  },
});