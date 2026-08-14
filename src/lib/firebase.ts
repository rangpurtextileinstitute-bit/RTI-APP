import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0910066318",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:385143212903:web:ffced6d5a2c581a7d9bdc2",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDWXrSdnmGEdgo7Si70kGnmL-iHNbG2WME",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0910066318.firebaseapp.com",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0910066318.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "385143212903"
};

let app = null;
let db = null;

try {
  const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey !== "your_api_key_here");
  if (isConfigured) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app, "ai-studio-niotron-cdf7a558-d5bb-482f-91f4-43b3144a74f4");
  }
} catch (e) {
  console.error("Failed to initialize Firebase:", e);
  app = null;
  db = null;
}

export { app, db };
