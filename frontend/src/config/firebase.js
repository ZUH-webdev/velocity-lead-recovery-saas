import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC2aiK7c2Qwr9OPWhyeLkciZqM0ijgc50o',
  authDomain: 'velocity-c492f.firebaseapp.com',
  projectId: 'velocity-c492f',
  storageBucket: 'velocity-c492f.firebasestorage.app',
  messagingSenderId: '398481541176',
  appId: '1:398481541176:web:7a3e806c22a7e649d7fecd',
  measurementId: 'G-8L3NTLC1DC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = getAnalytics(app);

// Initialize Auth
const auth = getAuth(app);

// Set persistence to local storage
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting persistence:', error);
});

export { app, auth, analytics };
