import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique UUID for job entries
 * Required because the Empllo API doesn't provide unique IDs
 */
export const generateUUID = (): string => {
  return uuidv4();
};