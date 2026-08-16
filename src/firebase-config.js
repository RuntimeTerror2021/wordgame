// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbNGDsAlfA4_svknffQgOWgXepHUJGLSA",
  authDomain: "the-wordgame.firebaseapp.com",
  projectId: "the-wordgame",
  storageBucket: "the-wordgame.firebasestorage.app",
  messagingSenderId: "103963075328",
  appId: "1:103963075328:web:9bec7fb3417bf03ce389e5",
  measurementId: "G-TCSPHW3GYY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);