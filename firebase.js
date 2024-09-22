// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYeyJXiX9TNrZiop0f6mAeNQoajXusON8",
  authDomain: "quotetracker-3d4e9.firebaseapp.com",
  projectId: "quotetracker-3d4e9",
  storageBucket: "quotetracker-3d4e9.appspot.com",
  messagingSenderId: "161980507448",
  appId: "1:161980507448:web:f70267f8110471d4a38dcd",
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const database = getFirestore(app);

export { app, database };
