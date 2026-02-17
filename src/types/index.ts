// Type definitions for the Job Finder App

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  mainCategory?: string;
  jobType?: string;
  workModel?: string;
  seniorityLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  locations?: string[];
  tags?: string[];
  description?: string;
  isSaved?: boolean;
}

export interface ApplicationFormData {
  name: string;
  email: string;
  contactNumber: string;
  whyHireYou: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  error: string;
  success: string;
  inputBackground: string;
}