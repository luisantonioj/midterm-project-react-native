import 'react-native-get-random-values';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

// A generic static namespace required by uuidv5
const APP_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; 

/**
 * Generates a unique UUID.
 * If a seed string is provided, it generates a FIXED, permanent UUID (v5).
 * If no seed is provided, it generates a random UUID (v4).
 */
export const generateUUID = (seed?: string): string => {
  if (seed) {
    return uuidv5(seed, APP_NAMESPACE);
  }
  return uuidv4();
};