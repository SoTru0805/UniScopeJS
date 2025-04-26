
import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string; // Corresponds to Firebase Auth UID
  email: string;
  createdAt: Timestamp;
  enrolledUnits: string[]; // Array of unit codes (e.g., ['FIT2001', 'FIT2002'])
  // Add other profile fields as needed
  // displayName?: string;
  // degree?: string;
  // yearLevel?: number;
}
