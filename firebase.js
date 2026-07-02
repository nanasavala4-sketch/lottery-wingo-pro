// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD7EAtMU0khSVOdcwvRPqiHPq4TYiCusxg",
  authDomain: "win-color-pro.firebaseapp.com",
  projectId: "win-color-pro",
  storageBucket: "win-color-pro.firebasestorage.app",
  messagingSenderId: "1025777239942",
  appId: "1:1025777239942:web:6c69f192e6ec7dcb940e07",
  measurementId: "G-7KXXW0JV0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
