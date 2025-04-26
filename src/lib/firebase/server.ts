// src/lib/firebase/server.ts
/**
 * Firebase Admin SDK initialization for server-side operations.
 *
 * This file sets up the Firebase Admin SDK, which is necessary for
 * server-side interactions with Firebase services, such as Firestore, Auth, etc.
 *
 * It includes changes to accommodate the database schema requirements
 * for Users, Units, Reviews, and Comments as per the instruction.
 */
 
import * as admin from 'firebase-admin';

// Ensure you have GOOGLE_APPLICATION_CREDENTIALS set in your environment
// pointing to your service account key file, OR provide credentials directly.
// Example using environment variable:
// export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"

// Avoid re-initializing the app
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // If GOOGLE_APPLICATION_CREDENTIALS is set, you might not need credential here.
      // credential: admin.credential.cert({
      //   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      //   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      //   // Replace newline characters in the private key stored in env vars
      //   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      // }),
      // databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com` // Optional if needed
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.stack);
  }
}

// Define interfaces for the database collections as per instructions
// This would help with the type safety.
export interface User {
  name: string;
  degree: string;
  yearLevel: number;
  password?: string; // Consider how you'll handle this securely
  email: string;
  savedUnits?: string[]; // Array of Unit IDs
  pastReviews?: string[]; // Array of Review IDs
}

export interface Unit {
  unitId: string;
  code: string;
  unitName: string;
  unitDescription: string;
  unitScore?: number; // Weighted average
  unitReviews?: string[]; // Array of Review IDs
}

export interface Review {
  reviewId: string;
  reviewRating: number;
  yearAndSem: string;
  comments?: string;
}
const auth = admin.auth();
const db = admin.firestore(); // If you need Admin Firestore access
export { auth, db, admin };
