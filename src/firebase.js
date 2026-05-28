import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9RQ8JKCHyh4jjbcUJayK3lUD5XwbEBxA",
  authDomain: "kings-kitchen-system.firebaseapp.com",
  projectId: "kings-kitchen-system",
  storageBucket: "kings-kitchen-system.firebasestorage.app",
  messagingSenderId: "181498758654",
  appId: "1:181498758654:web:a03c389978bad302246caf",
  measurementId: "G-845B235BFF"
};

const app = initializeApp(firebaseConfig);

// AUTH
export const auth = getAuth(app);

// GOOGLE PROVIDER
export const googleProvider = new GoogleAuthProvider();

// FIRESTORE
export const db = getFirestore(app);