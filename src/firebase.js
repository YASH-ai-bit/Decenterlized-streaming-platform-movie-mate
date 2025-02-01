// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore"; // For Firestore

// // const firebaseConfig = {
// //     apiKey: process.env.REACT_APP_API_KEY,
// //     authDomain: process.env.REACT_APP_AUTH_DOMAIN,
// //     projectId: process.env.REACT_APP_PROJECT_ID,
// //     storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
// //     messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
// //     appId: process.env.REACT_APP_APP_ID,
// //     measurementId: process.env.REACT_APP_MEASUREMENT_ID
// // };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firestore
// const firestore = getFirestore(app);

// export { firestore }; // Export Firestore instance
// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // For Firestore
import { getAuth, signInWithCustomToken } from "firebase/auth"; // For Firebase Auth

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth
const auth = getAuth(app);

export { db, auth, signInWithCustomToken }; // Export Firestore and Auth