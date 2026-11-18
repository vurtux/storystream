// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getRemoteConfig, RemoteConfig } from "firebase/remote-config";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

/** @type {import("firebase/remote-config").RemoteConfig | null} */
let remoteConfig = null;

if (typeof window !== "undefined") {
  remoteConfig = getRemoteConfig(app);
  remoteConfig.settings = {
    minimumFetchIntervalMillis: 3600000,
  };
  remoteConfig.defaultConfig = {
    welcome_message: "Welcome from default config!",
  };
}

export { app, analytics, remoteConfig };