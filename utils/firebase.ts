// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase Jloginflow-aafe3.firebaseapp.comS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtpRQsiy52FIgUHOzxTa7rCXSLqt3QvH0",
  authDomain: "http://localhost:3000/",
  projectId: "loginflow-aafe3",
  storageBucket: "loginflow-aafe3.firebasestorage.app",
  messagingSenderId: "498869793906",
  appId: "1:498869793906:web:fd8386f47a02a06a677eeb",
  measurementId: "G-E3YGK546CV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const googleProvider = new GoogleAuthProvider();

//Authentication
export const auth = getAuth();
