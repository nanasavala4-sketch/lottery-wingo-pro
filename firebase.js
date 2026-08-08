import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
const firebaseConfig = {
  apiKey: "तुमचा खरा API KEY",
  authDomain: "win-color-pro.firebaseapp.com",
  projectId: "win-color-pro",
  storageBucket: "win-color-pro.firebasestorage.app",
  messagingSenderId: "तुमचा खरा SENDER ID",
  appId: "तुमचा खरा APP ID"
};



const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
