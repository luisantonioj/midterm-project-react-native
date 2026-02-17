// Type definitions for the Job Finder App

export interface Job {
  id: string; // UUID generated locally
  title: string;
  company: string;
  salary?: string;
  location?: string;
  description?: string;
  requirements?: string[];
  type?: string; // Full-time, Part-time, Contract, etc.
  postedDate?: string;
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