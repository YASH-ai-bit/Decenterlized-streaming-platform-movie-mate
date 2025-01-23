// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFIoTQTxqc6saBxN_JOE5eeJ5EAmwIRA8",
  authDomain: "white-board-68c2d.firebaseapp.com",
  projectId: "white-board-68c2d",
  storageBucket: "white-board-68c2d.firebasestorage.app",
  messagingSenderId: "78325439610",
  appId: "1:78325439610:web:cacc053bf408769e6dafc3",
  measurementId: "G-9EWMDW70J3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);