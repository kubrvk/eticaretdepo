import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCu9Xa-mmTzK9_mrH5YZPuUtQIEAzUvmCE",
  authDomain: "eticaretdepo.firebaseapp.com",
  projectId: "eticaretdepo",
  storageBucket: "eticaretdepo.firebasestorage.app",
  messagingSenderId: "125911679804",
  appId: "1:125911679804:web:f0e0156efa41bfd6ed1439"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
