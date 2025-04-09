import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBc2dAluNusLp0MgkseZkeKL5Elzfr8OT0",
  authDomain: "journey-craft-c5001.firebaseapp.com",
  projectId: "journey-craft-c5001",
  storageBucket: "journey-craft-c5001.firebasestorage.app",
  messagingSenderId: "663123280757",
  appId: "1:663123280757:web:b4f410ce101c45f6d5c93c",
  measurementId: "G-ZKLCGGH7CW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

export { auth, analytics, googleProvider, signInWithPopup };
export default app;