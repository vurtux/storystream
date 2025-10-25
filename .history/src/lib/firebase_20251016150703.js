import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getRemoteConfig,
  fetchAndActivate,
  getAll,
  getValue,
} from "firebase/remote-config";

const firebaseConfig = {
  apiKey: "AIzaSyBzf4a3klT1JGYu0WpI_h1jJylOcnqImkY",
  authDomain: "storystream-2965b.firebaseapp.com",
  projectId: "storystream-2965b",
  storageBucket: "storystream-2965b.firebasestorage.app",
  messagingSenderId: "585951737951",
  appId: "1:585951737951:web:ac22a0ff9179ecb0d283ea",
  measurementId: "G-JR317RMKSL",
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// 🧠 Remote Config setup
let remoteConfig = null;

if (typeof window !== "undefined") {
  remoteConfig = getRemoteConfig(app);
  remoteConfig.settings = {
    minimumFetchIntervalMillis: 3600000, // 1 hour
  };
  remoteConfig.defaultConfig = {
    welcome_message: "Welcome from default config!",
  };

  // 🚀 Fetch and log all remote config values
  fetchAndActivate(remoteConfig)
    .then(() => {
      const allValues = getAll(remoteConfig);
      console.log("✅ Remote Config values:");
      Object.entries(allValues).forEach(([key, val]) => {
        console.log(`- ${key}:`, val._value);
      });

      // Example: get a specific value
      const welcomeMsg = getValue(remoteConfig, "welcome_message").asString();
      console.log("🟢 welcome_message:", welcomeMsg);
    })
    .catch((err) => console.error("❌ Remote Config fetch error:", err));
}

export { app, analytics, remoteConfig };
