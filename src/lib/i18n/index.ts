// LaufplanerPro - Internationalization System
// Simple utility for handling translations

import { en } from './en';

// Currently only supporting English, but this can be extended
export const currentLanguage = 'en';
export const translations = { en };

// Simple translation function
export function t(key: string): string {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key; // Return the key itself if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// Export the current language translations for direct use
export const lang = translations[currentLanguage];
