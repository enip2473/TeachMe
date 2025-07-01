
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfzk87iEhj-NbowlYeiCf1o4SKHYCkmBc",
  authDomain: "eduverse-m4agi.firebaseapp.com",
  projectId: "eduverse-m4agi",
  storageBucket: "eduverse-m4agi.firebasestorage.app",
  messagingSenderId: "734997899634",
  appId: "1:734997899634:web:c1b2abfeee6ced00b055eb",
  measurementId: "G-Y4F40WG626"
};

// Initialize Firebase

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
