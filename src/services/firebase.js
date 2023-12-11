import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFNDugW2hugKPVIs54Pe9tFGOh6ggL0co",
  authDomain: "reactapp-d386d.firebaseapp.com",
  projectId: "reactapp-d386d",
  storageBucket: "reactapp-d386d.appspot.com",
  messagingSenderId: "834244835344",
  appId: "1:834244835344:web:a96645395b3a0a341ef295",
  measurementId: "G-T8LWWVTEPB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore, analytics };
