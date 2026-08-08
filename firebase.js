import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "तुमचा सध्याचा apiKey",
    authDomain: "win-color-pro.firebaseapp.com",
    projectId: "win-color-pro",
    storageBucket: "win-color-pro.firebasestorage.app",
    messagingSenderId: "1025777239942",
    appId: "तुमचा सध्याचा appId",
    measurementId: "तुमचा सध्याचा measurementId"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
