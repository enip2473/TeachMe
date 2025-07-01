
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics'; // Import isSupported
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
let analytics;
// Conditionally initialize Analytics only if running in a browser and supported
if (typeof window !== 'undefined') {
  // Check if window is defined (i.e., we are in a browser environment)
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    } else {
      console.warn("Firebase Analytics is not supported in this environment.");
    }
  });
}
const db = getFirestore(app, 'default');

export { app, analytics, db };
