import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtCX0SD09M6pZCmws-x1yLdXkjE2KCNvQ",
  authDomain: "stevens-fabrication-laboratory.firebaseapp.com",
  projectId: "stevens-fabrication-laboratory",
  storageBucket: "stevens-fabrication-laboratory.firebasestorage.app",
  messagingSenderId: "903420674578",
  appId: "1:903420674578:web:1304ec533456ca33cdcecb",
  measurementId: "G-7L5MSNQZVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
