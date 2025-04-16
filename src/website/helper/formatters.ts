/**
 * Utility functions for formatting various types of data
 */

/**
 * Common country codes for phone numbers
 */
export interface CountryCode {
  code: string;  // The country code with + prefix
  name: string;  // The country name
  flag?: string; // Optional emoji flag
}

export const COMMON_COUNTRY_CODES: CountryCode[] = [
  { code: '+1', name: 'United States/Canada', flag: '🇺🇸' },
  { code: '+7', name: 'Russia/Kazakhstan', flag: '🇷🇺' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹' },
  { code: '+353', name: 'Ireland', flag: '🇮🇪' },
  { code: '+358', name: 'Finland', flag: '🇫🇮' },
  { code: '+380', name: 'Ukraine', flag: '🇺🇦' },
  { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+972', name: 'Israel', flag: '🇮🇱' },
  // Add a comment to indicate that this is a reduced list
  // Full list can be found at: https://en.wikipedia.org/wiki/List_of_country_calling_codes
];

/**
 * Formats just the phone number part (without country code) with proper spacing
 *
 * @param phoneNumber - The phone number without country code
 * @param countryCode - The country code to determine formatting style
 * @returns The formatted phone number
 */
export function formatPhoneNumberPart(phoneNumber: string, countryCode: string = ''): string {
  // If empty, return as is
  if (!phoneNumber || phoneNumber.trim() === '') {
    return phoneNumber;
  }

  // Extract only digits
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  if (digitsOnly.length === 0) {
    return '';
  }

  // Format based on country code
  if (countryCode === '+1') {
    // North American format: XXX XXX XXXX
    const areaCode = digitsOnly.substring(0, 3);
    const prefix = digitsOnly.substring(3, 6);
    const lineNumber = digitsOnly.substring(6);

    let formatted = '';
    if (areaCode) formatted += areaCode;
    if (prefix) formatted += ' ' + prefix;
    if (lineNumber) formatted += ' ' + lineNumber;

    return formatted;
  }
  else if (countryCode === '+44') {
    // UK format: XXXX XXX XXX
    const firstPart = digitsOnly.substring(0, 4);
    const secondPart = digitsOnly.substring(4, 7);
    const thirdPart = digitsOnly.substring(7);

    let formatted = '';
    if (firstPart) formatted += firstPart;
    if (secondPart) formatted += ' ' + secondPart;
    if (thirdPart) formatted += ' ' + thirdPart;

    return formatted;
  }
  else {
    // Generic format: group in blocks of 3
    let formatted = '';
    for (let i = 0; i < digitsOnly.length; i += 3) {
      if (i > 0) formatted += ' ';
      formatted += digitsOnly.substring(i, Math.min(i + 3, digitsOnly.length));
    }
    return formatted;
  }
}

/**
 * Formats a complete phone number with country code and proper spacing
 *
 * @param phoneNumber - The raw phone number input
 * @returns The formatted phone number with proper spacing
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // If empty, return as is
  if (!phoneNumber || phoneNumber.trim() === '') {
    return phoneNumber;
  }

  // Extract only digits and the plus sign
  const digitsOnly = phoneNumber.replace(/[^\d+]/g, '');

  // If it's just a plus sign, return it
  if (digitsOnly === '+') {
    return '+';
  }

  // Handle North American numbers (+1)
  if (digitsOnly.startsWith('+1')) {
    const areaCode = digitsOnly.substring(2, 5);
    const prefix = digitsOnly.substring(5, 8);
    const lineNumber = digitsOnly.substring(8);

    let formatted = '+1';
    if (areaCode) formatted += ' ' + areaCode;
    if (prefix) formatted += ' ' + prefix;
    if (lineNumber) formatted += ' ' + lineNumber;

    return formatted;
  }
  // Handle UK numbers (+44)
  else if (digitsOnly.startsWith('+44')) {
    const firstPart = digitsOnly.substring(3, 7);
    const secondPart = digitsOnly.substring(7, 10);
    const thirdPart = digitsOnly.substring(10);

    let formatted = '+44';
    if (firstPart) formatted += ' ' + firstPart;
    if (secondPart) formatted += ' ' + secondPart;
    if (thirdPart) formatted += ' ' + thirdPart;

    return formatted;
  }
  // Handle other international numbers
  else if (digitsOnly.startsWith('+')) {
    // Find the country code (1-3 digits after +)
    const countryCodeMatch = digitsOnly.match(/^\+(\d{1,3})/);
    if (countryCodeMatch) {
      const countryCode = countryCodeMatch[1];
      const remaining = digitsOnly.substring(countryCode.length + 1); // +1 for the '+' character

      // Format with spaces every 3 digits
      let formatted = '+' + countryCode;

      // Add spaces every 3 digits
      for (let i = 0; i < remaining.length; i += 3) {
        formatted += ' ' + remaining.substring(i, Math.min(i + 3, remaining.length));
      }

      return formatted;
    }
  }
  // Handle numbers without country code
  else if (digitsOnly.length > 0) {
    // Add spaces every 3 digits for readability
    let formatted = '';
    for (let i = 0; i < digitsOnly.length; i += 3) {
      if (i > 0) formatted += ' ';
      formatted += digitsOnly.substring(i, Math.min(i + 3, digitsOnly.length));
    }
    return formatted;
  }

  // If nothing else matched, return the original input
  return phoneNumber;
}

/**
 * Validates if a string is a valid email address
 *
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formats a URL by ensuring it has the proper protocol prefix
 *
 * @param url - The URL to format
 * @returns The formatted URL with proper protocol
 */
export function formatUrl(url: string): string {
  if (!url || url.trim() === '') {
    return url;
  }

  // If URL doesn't start with a protocol, add https://
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }

  return url;
}

/**
 * Formats a date to a localized string representation
 *
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @param options - DateTimeFormat options
 * @returns The formatted date string
 */
export function formatDate(
  date: Date,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

