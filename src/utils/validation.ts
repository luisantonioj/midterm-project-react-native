import { ValidationError } from '../types';

/**
 * Validates if a field is not empty
 */
export const validateRequired = (value: string, fieldName: string): ValidationError | null => {
  if (!value || value.trim() === '') {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
    };
  }
  return null;
};

/**
 * Validates email format using regex
 */
export const validateEmail = (email: string): ValidationError | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || email.trim() === '') {
    return {
      field: 'email',
      message: 'Email is required',
    };
  }
  
  if (!emailRegex.test(email)) {
    return {
      field: 'email',
      message: 'Please enter a valid email address',
    };
  }
  
  return null;
};

/**
 * Validates contact number (numeric only with length constraints)
 */
export const validateContactNumber = (contactNumber: string): ValidationError | null => {
  const numericRegex = /^\d+$/;
  
  if (!contactNumber || contactNumber.trim() === '') {
    return {
      field: 'contactNumber',
      message: 'Contact number is required',
    };
  }
  
  if (!numericRegex.test(contactNumber)) {
    return {
      field: 'contactNumber',
      message: 'Contact number must contain only digits',
    };
  }
  
  if (contactNumber.length < 10 || contactNumber.length > 15) {
    return {
      field: 'contactNumber',
      message: 'Contact number must be between 10 and 15 digits',
    };
  }
  
  return null;
};

/**
 * Validates minimum length for text fields
 */
export const validateMinLength = (
  value: string,
  fieldName: string,
  minLength: number
): ValidationError | null => {
  if (!value || value.trim() === '') {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
    };
  }
  
  if (value.trim().length < minLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${minLength} characters`,
    };
  }
  
  return null;
};

/**
 * Validates all form fields and returns array of errors
 */
export const validateApplicationForm = (
  name: string,
  email: string,
  contactNumber: string,
  whyHireYou: string
): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const nameError = validateRequired(name, 'Name');
  if (nameError) errors.push(nameError);
  
  const emailError = validateEmail(email);
  if (emailError) errors.push(emailError);
  
  const contactError = validateContactNumber(contactNumber);
  if (contactError) errors.push(contactError);
  
  const whyError = validateMinLength(whyHireYou, 'Why should we hire you', 20);
  if (whyError) errors.push(whyError);
  
  return errors;
};