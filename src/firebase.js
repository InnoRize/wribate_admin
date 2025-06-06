"use client"

// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APP_BASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_APP_BASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_APP_BASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_APP_BASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_APP_BASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APP_BASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_APP_BASE_MEASUREMENTID,
};

// Create provider instances for each service
const googleProvider = new GoogleAuthProvider();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  googleProvider,
};
