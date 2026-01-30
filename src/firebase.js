// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfgvp_a61IO83727PnejsdKWhGWRTZQBk ",
  authDomain: "earnflow-admin.firebaseapp.com",
  projectId: "earnflow-admin",
  storageBucket: "earnflow-admin.firebasestorage.app",
  messagingSenderId: "321056904100",
  appId: "1:321056904100:web:fe1161abb612dce5ebe731"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);   // ✅ IMPORTANT