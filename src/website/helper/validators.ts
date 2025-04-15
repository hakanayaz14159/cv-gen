/**
 * Validation utilities for form inputs
 */

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns An object with isValid flag and error message if invalid
 */
export function validateEmail(email: string): { isValid: boolean; message?: string } {
  if (!email || email.trim() === '') {
    return { isValid: true }; // Empty is considered valid (optional field)
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  
  return {
    isValid,
    message: isValid ? undefined : 'Please enter a valid email address'
  };
}

/**
 * Validates a phone number
 * @param phoneNumber - The phone number to validate (with or without country code)
 * @returns An object with isValid flag and error message if invalid
 */
export function validatePhoneNumber(phoneNumber: string): { isValid: boolean; message?: string } {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return { isValid: true }; // Empty is considered valid (optional field)
  }

  // Remove all non-digit characters except +
  const digitsOnly = phoneNumber.replace(/[^\d+]/g, '');
  
  // Check if it has at least a country code (+ and 1-3 digits) and at least 5 more digits
  // This is a very basic validation that should work for most international numbers
  const isValid = /^\+\d{1,3}\d{5,}$/.test(digitsOnly);
  
  return {
    isValid,
    message: isValid ? undefined : 'Please enter a valid phone number with country code'
  };
}

/**
 * Validates a URL
 * @param url - The URL to validate
 * @returns An object with isValid flag and error message if invalid
 */
export function validateUrl(url: string): { isValid: boolean; message?: string } {
  if (!url || url.trim() === '') {
    return { isValid: true }; // Empty is considered valid (optional field)
  }

  try {
    // Try to create a URL object - this will throw if invalid
    new URL(url);
    return { isValid: true };
  } catch (e) {
    return {
      isValid: false,
      message: 'Please enter a valid URL (e.g., https://example.com)'
    };
  }
}

/**
 * Validates a date range
 * @param startDate - The start date
 * @param endDate - The end date (optional)
 * @param allowEqual - Whether to allow start and end dates to be the same
 * @returns An object with isValid flag and error message if invalid
 */
export function validateDateRange(
  startDate: string | Date,
  endDate?: string | Date,
  allowEqual: boolean = false
): { isValid: boolean; message?: string } {
  if (!startDate) {
    return {
      isValid: false,
      message: 'Start date is required'
    };
  }

  // If no end date, it's valid
  if (!endDate) {
    return { isValid: true };
  }

  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);

  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isValid: false,
      message: 'Please enter valid dates'
    };
  }

  // Check if end date is after start date
  const isValid = allowEqual 
    ? start.getTime() <= end.getTime() 
    : start.getTime() < end.getTime();

  return {
    isValid,
    message: isValid ? undefined : 'End date must be after start date'
  };
}

/**
 * Validates a text field with length constraints
 * @param text - The text to validate
 * @param minLength - Minimum length (default: 1)
 * @param maxLength - Maximum length (default: 255)
 * @param fieldName - Name of the field for the error message
 * @returns An object with isValid flag and error message if invalid
 */
export function validateText(
  text: string,
  minLength: number = 1,
  maxLength: number = 255,
  fieldName: string = 'Field'
): { isValid: boolean; message?: string } {
  if (!text && minLength === 0) {
    return { isValid: true }; // Empty is valid if minLength is 0
  }

  const trimmedText = text?.trim() || '';
  
  if (trimmedText.length < minLength) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${minLength} characters`
    };
  }
  
  if (trimmedText.length > maxLength) {
    return {
      isValid: false,
      message: `${fieldName} must be no more than ${maxLength} characters`
    };
  }
  
  return { isValid: true };
}

/**
 * Validates a numeric value within a range
 * @param value - The numeric value to validate
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @param fieldName - Name of the field for the error message
 * @returns An object with isValid flag and error message if invalid
 */
export function validateNumber(
  value: number | undefined,
  min: number,
  max: number,
  fieldName: string = 'Value'
): { isValid: boolean; message?: string } {
  // If value is undefined and min is not 0, it's valid (optional field)
  if (value === undefined) {
    return { isValid: true };
  }
  
  if (isNaN(value)) {
    return {
      isValid: false,
      message: `${fieldName} must be a valid number`
    };
  }
  
  if (value < min) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${min}`
    };
  }
  
  if (value > max) {
    return {
      isValid: false,
      message: `${fieldName} must be no more than ${max}`
    };
  }
  
  return { isValid: true };
}
