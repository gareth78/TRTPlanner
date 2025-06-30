// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzi83JX-klIIak_S1jvXrDUjvSwiaLRFo",
  authDomain: "meditrack-c20a7.firebaseapp.com",
  projectId: "meditrack-c20a7",
  storageBucket: "meditrack-c20a7.firebasestorage.app",
  messagingSenderId: "718086036874",
  appId: "1:718086036874:web:409b553b32bf9ac35b3c73",
  measurementId: "G-TLYF3TTXMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);