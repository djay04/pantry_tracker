// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCErndJOkmLthWrR0gjVBlBr5bUAlFU_vs",
  authDomain: "pantry-tracker-829c0.firebaseapp.com",
  projectId: "pantry-tracker-829c0",
  storageBucket: "pantry-tracker-829c0.appspot.com",
  messagingSenderId: "79642362861",
  appId: "1:79642362861:web:7beb191593f322c1d95de4",
  measurementId: "G-M58JY8H1Y6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };