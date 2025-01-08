// firebaseConfig.js

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; // <-- Vous avez bien ajouté ceci

const firebaseConfig = {
  apiKey: "AIzaSyBNfQ0i5j-m8oulMfCQwCKrkq3YwkrYg5A",
  authDomain: "breaksolidaire-native.firebaseapp.com",
  projectId: "breaksolidaire-native",
  storageBucket: "breaksolidaire-native.appspot.com",
  messagingSenderId: "443753830769",
  appId: "1:443753830769:web:8f6e679d795a0857a8bed0",
  measurementId: "G-S2TWZF3JWW"
};

// Initialiser Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Si Firebase est déjà initialisé
}

// Références aux services Firebase
const auth = firebase.auth();
const db = firebase.firestore(); // Référence à Firestore
const storage = firebase.storage(); // Référence au stockage

export { auth, db, storage }; // Exporter `storage`