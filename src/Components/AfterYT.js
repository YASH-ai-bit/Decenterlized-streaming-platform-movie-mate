import React, { useState } from "react";
import { getContract } from "../Room.js"; // Import the web3.js file
import "./AfterYT.css";

const AfterYT = ({ closeModal }) => {
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);


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
      const contract = await getContract(); // Get the smart contract instance
      const tx = await contract.createRoom(); // Call createRoom
      console.log("Transaction Sent:", tx); // Log transaction object
  
      const receipt = await tx.wait(); // Wait for transaction confirmation
      console.log("Transaction Receipt:", receipt); // Log receipt for debugging

      console.log("Transaction Hash:", tx.hash);
      console.log("Receipt Events:", receipt.events);
      console.log("Room Code Extracted:", roomCode);
  
      // Extract roomCode from the receipt
      const event = receipt.events?.find((event) => event.event === "RoomCreated");
      console.log("Event Data:", event); // Log event data
  
      if (!event) {
        throw new Error("RoomCreated event not found in receipt.");
      }
  
      const roomCode = event.args?.roomCode; // Extract roomCode
      if (!roomCode) {
        throw new Error("Room code not found in event args.");
      }
  
      alert(`Board created successfully! Code: ${roomCode}`);
    } catch (error) {
      console.error("Error creating board:", error.message || error);
      alert("Failed to create board. Check console for details.");
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
      const contract = await getContract();
      const tx = await contract.joinRoom(roomCode); // Call the smart contract function
      await tx.wait(); // Wait for the transaction to complete
      alert(`Successfully joined board: ${roomCode}`);
    } catch (error) {
      console.error("Error joining board:", error.message);
      alert("Failed to join board. Either you've already joined or the board doesn't exist.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="after-yt-container">
      <div className="blur-background"></div>
      <div className="modal">
        <h2 className="modal-heading">
          You<span className="red">Tube</span> - Over the Board!
        </h2>
        <div className="button-container">
          <button
            className="btn create-room-btn"
            onClick={handleCreateBoard}
            disabled={isCreating}
          >
            <span className="white">{isCreating ? "Creating..." : "Create Board"}</span>
          </button>
          <div className="join-room">
            <input
              type="text"
              placeholder="Enter Board Code"
              className="room-code-input"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <button
              className="btn join-room-btn"
              onClick={handleJoinBoard}
              disabled={isJoining}
            >
              <span className="white">{isJoining ? "Joining..." : "Join Board"}</span>
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
