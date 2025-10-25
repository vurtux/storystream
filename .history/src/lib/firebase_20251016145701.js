// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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
console.log("✅ Firebase initialized:", app.name);


export { app, analytics };
