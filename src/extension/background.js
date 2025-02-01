// background.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Listen for Firestore updates
const roomCode = "ROOM_CODE"; // Replace with the actual room code
const roomRef = doc(db, "rooms", roomCode);

onSnapshot(roomRef, (snapshot) => {
  const roomData = snapshot.data();
  if (roomData) {
    const { isPlaying, currentTime } = roomData.playbackState;

    // Send a message to the content script to update the video player
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "syncPlayback",
        isPlaying,
        currentTime,
      });
    });
  }
});