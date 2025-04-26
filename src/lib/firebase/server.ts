// src/lib/firebase/server.ts
// NOTE: This setup is for using Firebase Admin SDK on the server.
// If you only need client-side auth or are using a different provider (like Clerk),
// you might not need this specific file.

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

const auth = admin.auth();
const db = admin.firestore(); // If you need Admin Firestore access

export { auth, db, admin };
