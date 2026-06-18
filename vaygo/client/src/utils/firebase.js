import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCg8q-6Zgb1RXvTsrLdNsGcMM7_XTBQObY",
  authDomain: "vaygo-7578c.firebaseapp.com",
  projectId: "vaygo-7578c",
  storageBucket: "vaygo-7578c.firebasestorage.app",
  messagingSenderId: "313194345400",
  appId: "1:313194345400:web:261ed155efd240de5e954d",
  measurementId: "G-XCFF454PBP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
