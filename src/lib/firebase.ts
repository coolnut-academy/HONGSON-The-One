// Firebase Configuration for HONGSON THE ONE
// ============================================
// This file initializes the Firebase app and exports Firestore instance.

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase configuration object
// These values are loaded from environment variables for security
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App (prevent re-initialization on hot reload)
const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize Firestore Database
const db: Firestore = getFirestore(app);

export { app, db };
