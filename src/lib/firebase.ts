import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0910066318",
  appId: "1:385143212903:web:ffced6d5a2c581a7d9bdc2",
  apiKey: "AIzaSyDWXrSdnmGEdgo7Si70kGnmL-iHNbG2WME",
  authDomain: "gen-lang-client-0910066318.firebaseapp.com",
  storageBucket: "gen-lang-client-0910066318.firebasestorage.app",
  messagingSenderId: "385143212903"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-niotron-cdf7a558-d5bb-482f-91f4-43b3144a74f4");
