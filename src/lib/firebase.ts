import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import getAuth

// Check if the essential API key environment variable is set
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.warn(
    "Firebase API key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing. " +
    "Please ensure it is set in your .env file and the server is restarted. " +
    "Firebase services requiring this key might not work correctly."
  );
}


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase initialization error:", error);
     // Log the config being used, omitting the API key for security in logs if needed,
     // but for debugging, knowing if it was undefined is useful.
     console.error("Firebase config used (API key omitted for security if present):", {
       ...firebaseConfig,
       apiKey: firebaseConfig.apiKey ? '***' : 'undefined/missing',
     });
     // Potentially re-throw or handle depending on how critical Firebase is at startup
     throw error;
  }

} else {
  app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app); // Initialize Auth

export { db, auth, app }; // Export auth
