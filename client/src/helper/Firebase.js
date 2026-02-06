// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getenv } from "./getenv";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: getenv('FIREBASE_URL'),
  authDomain: "blog-52ca4.firebaseapp.com",
  projectId: "blog-52ca4",
  storageBucket: "blog-52ca4.firebasestorage.app",
  messagingSenderId: "766998301235",
  appId: "1:766998301235:web:381da58ff6330950b97146",
  measurementId: "G-BTLY92XN22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}