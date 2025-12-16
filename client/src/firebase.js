// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
export const storage = getStorage(app);