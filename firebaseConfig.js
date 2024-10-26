import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importer kun getFirestore

const firebaseConfig = {
    apiKey: "AIzaSyAruP8b0ODufJj1p1-aoW1y1mqhOMXjg8s",
    authDomain: "afleverings-ogpave.firebaseapp.com",
    projectId: "afleverings-ogpave",
    storageBucket: "afleverings-ogpave.appspot.com",
    messagingSenderId: "802713109452",
    appId: "1:802713109452:web:68650324f5ab389f07d369"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Få Firestore instansen

export { app, db }; // Eksportér både app og db
