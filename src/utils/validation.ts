import { ValidationError } from '../types';

export const validateName = (name: string): string => {
  if (!name || name.trim() === '') {
    return 'Full Name is required';
  }
  return '';
};

export const validateEmail = (email: string): string => {
  if (!email || email.trim() === '') {
    return 'Email Address is required';
  }
  
  // This Regex ensures it has letters, an '@', a domain name, a '.', and an extension (.com, .ph, etc.)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email (e.g., name@gmail.com)';
  }
  
  return '';
};

export const validateContactNumber = (contactNumber: string): string => {
  const numericRegex = /^\d+$/; 
  
  if (!contactNumber || contactNumber.trim() === '') {
    return 'Contact Number is required';
  }
  
  if (!numericRegex.test(contactNumber)) {
    return 'Contact Number must contain only numbers';
  }
  
  if (contactNumber.length !== 11) {
    return 'Contact Number must be exactly 11 digits';
  }
  
  return '';
};