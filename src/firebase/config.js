// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEGn-1ZR0D9u6VAh-XFzpwrblFjBmMLV0",
  authDomain: "myutilitybox-pro.firebaseapp.com",
  projectId: "myutilitybox-pro",
  storageBucket: "myutilitybox-pro.firebasestorage.app",
  messagingSenderId: "464298229837",
  appId: "1:464298229837:web:4931ac1b07987ee0b1dc04",
  measurementId: "G-M1SDKEHYSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

export default app;
