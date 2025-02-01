// AfterYT.js
import React, { useState, useEffect } from "react";
import { getContract } from "../Room.js"; // Import the web3.js file
import { db } from "../firebase.js"; // Import Firestore
import { doc, setDoc, updateDoc, onSnapshot } from "firebase/firestore"; // Firestore functions
import "./AfterYT.css";

const AfterYT = ({ closeModal }) => {
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [partyLink, setPartyLink] = useState("");

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      alert("Wallet connected!");
    } catch (error) {
      console.error("Error connecting wallet:", error.message);
    }
  };

  // Create Room Handler
  const handleCreateBoard = async () => {
    try {
      setIsCreating(true); // Start loading
      await connectWallet(); // Connect to MetaMask
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const userAddress = accounts[0]; // Get the user's address

      // Generate a room code using the smart contract
      const contract = await getContract();
      const tx = await contract.createRoom();
      const receipt = await tx.wait();

      // ✅ Extract Room Code from Event Logs
      const eventLog = receipt.logs.find(log => {
        try {
          const decoded = contract.interface.parseLog(log);
          return decoded?.name === "RoomCreated";
        } catch {
          return false;
        }
      });

      if (!eventLog) {
        throw new Error("RoomCreated event not found.");
      }

      const decoded = contract.interface.parseLog(eventLog);
      const roomCode = decoded.args.roomCode; // Extract the roomCode
      const creator = decoded.args.creator;

      if (!roomCode) {
        throw new Error("Room code extraction failed.");
      }

      console.log("Extracted Room Code:", roomCode);

      // ✅ Store room information in Firestore
      await setDoc(doc(db, "rooms", roomCode), {
        creatorId: creator,
        users: [creator],
        video: null,
        playbackState: { isPlaying: false, currentTime: 0 },
      });

      console.log("Room saved to Firestore successfully!");

      // ✅ Generate YouTube Party Link
      const syncLink = `${window.location.origin}/join/${roomCode}`;
      setPartyLink(syncLink);

      alert(`Successfully created board! Share this link: ${syncLink}`);
    } catch (error) {
      console.error("Error creating board:", error.message || error);
      alert(`Failed to create board: ${error.message}`);
    } finally {
      setIsCreating(false); // Stop loading
    }
  };

  // Join Room Handler
  const handleJoinBoard = async () => {
    try {
      if (!roomCode) {
        alert("Please enter a valid board code.");
        return;
      }
      setIsJoining(true);

      // Connect to MetaMask and get the user's address
      await connectWallet();
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const userAddress = accounts[0];

      // Add user to the room in Firestore
      const roomRef = doc(db, "rooms", roomCode);
      await updateDoc(roomRef, {
        users: [...(roomRef.data()?.users || []), userAddress], // Add the user to the users list
      });

      alert(`Successfully joined board: ${roomCode}`);
    } catch (error) {
      console.error("Error joining board:", error.message);
      alert("Failed to join board. Either you've already joined or the board doesn't exist.");
    } finally {
      setIsJoining(false);
    }
  };

  // Real-Time Playback Synchronization
  useEffect(() => {
    if (!roomCode) return;

    const roomRef = doc(db, "rooms", roomCode);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      const roomData = snapshot.data();
      if (roomData) {
        const { isPlaying, currentTime } = roomData.playbackState;

        // Control the YouTube player
        const video = document.querySelector("video");
        if (video) {
          if (isPlaying) video.play();
          else video.pause();
          video.currentTime = currentTime;
        }
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [roomCode]);

  return (
    <div className="after-yt-container">
      <div className="blur-background"></div>
      <div className="modal">
        <h2 className="modal-heading">
          You<span className="red">Tube</span> - Over the Party!
        </h2>
        <div className="button-container">
          <button
            className="btn create-room-btn"
            onClick={handleCreateBoard}
            disabled={isCreating}
          >
            <span className="white">{isCreating ? "Creating..." : "Create Party"}</span>
          </button>

          {partyLink && (
            <div className="party-link-container">
              <p>Share this link:</p>
              <input type="text" value={partyLink} readOnly className="party-link-input" />
              <button
                className="btn copy-btn"
                onClick={() => navigator.clipboard.writeText(partyLink)}
              >
                Copy Link
              </button>
            </div>
          )}

          <div className="join-room">
            <input
              type="text"
              placeholder="Enter Party Code"
              className="room-code-input"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <button
              className="btn join-room-btn"
              onClick={handleJoinBoard}
              disabled={isJoining}
            >
              <span className="white">{isJoining ? "Joining..." : "Join Party"}</span>
            </button>
          </div>
        </div>
        <button className="btn close-btn" onClick={closeModal}>
          <span className="white">Close</span>
        </button>
      </div>
    </div>
  );
};

export default AfterYT;