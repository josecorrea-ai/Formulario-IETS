import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwRLxH5v0I8DNjbVBjsDBY644tNKcLGY8",
  authDomain: "formulario-iets.firebaseapp.com",
  projectId: "formulario-iets",
  storageBucket: "formulario-iets.firebasestorage.app",
  messagingSenderId: "204018982145",
  appId: "1:204018982145:web:f613d0bc160daa49598f00",
  measurementId: "G-04FGK2VS1D"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
