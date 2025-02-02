import React, { useState, useEffect } from "react";
import io from "socket.io-client"; 
import { getContract } from "../Room.js";
import { keccak256, toUtf8Bytes } from "ethers";
import "./AfterYT.css";

const AfterYT = ({ closeModal }) => {
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [partyLink, setPartyLink] = useState("");
  const [socket, setSocket] = useState(null); 

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

  // WebSocket connection setup using Socket.io
  useEffect(() => {
    const newSocket = io("http://localhost:8080"); 
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server.");
    });

    // Listen for playback updates from the server
    newSocket.on("playback", (data) => {
      const video = document.querySelector("video");
      if (video) {
        if (data.action === "play") {
          video.play();
        } else if (data.action === "pause") {
          video.pause();
        } else if (data.action === "seek") {
          video.currentTime = data.currentTime;
        }
      }
    });

    // Cleanup on component unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Create Room Handler
  const handleCreateBoard = async () => {
    try {
      setIsCreating(true); 
      await connectWallet(); 
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const userAddress = accounts[0]; 
  
      // Call the smart contract to create a room
      const contract = await getContract(); 
      const tx = await contract.createRoom(); 
      const receipt = await tx.wait();
  
      // Event signature for RoomCreated (bytes32 indexed roomCode, address indexed creator)
      const eventSignature = "RoomCreated(bytes32,address)";
      const eventTopic = keccak256(toUtf8Bytes(eventSignature));
  
      // Find the event log that matches the event topic
      const eventLog = receipt.logs.find((log) => log.topics[0] === eventTopic);
      if (!eventLog) {
        throw new Error("RoomCreated event not found in transaction logs.");
      }
  
      const roomCodeTopic = eventLog.topics[1]; 
      if (!roomCodeTopic) {
        throw new Error("Room code not found in event topics.");
      }

      const roomCodeHex = `0x${roomCodeTopic.slice(26)}`; 
      setRoomCode(roomCodeHex); 
      console.log("Extracted Room Code (Hex):", roomCodeHex);
  
      socket.emit("createRoom", { roomCode: roomCodeHex, creator: userAddress });
  
      const syncLink = `https://www.youtube.com/watch?v=${roomCodeHex}`;
      setPartyLink(syncLink);
  
      alert(`Successfully created board! Share this link: ${syncLink}`);
    } catch (error) {
      console.error("Error creating board:", error.message || error);
      alert(`Failed to create board: ${error.message}`);
    } finally {
      setIsCreating(false);
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

      await connectWallet();
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const userAddress = accounts[0];

      socket.emit("joinRoom", { roomCode, userAddress });

      alert(`Successfully joined board: ${roomCode}`);
    } catch (error) {
      console.error("Error joining board:", error.message);
      alert("Failed to join board. Either you've already joined or the board doesn't exist.");
    } finally {
      setIsJoining(false);
    }
  };

  useEffect(() => {
    if (!roomCode || !socket) return;
    const video = document.querySelector("video");
    if (video) {
      video.onplay = () => {
        socket.emit("playback", {
          action: "play",
          roomCode,
        });
      };
      video.onpause = () => {
        socket.emit("playback", {
          action: "pause",
          roomCode,
        });
      };
      video.onseeked = () => {
        socket.emit("playback", {
          action: "seek",
          currentTime: video.currentTime,
          roomCode,
        });
      };
    }
  }, [roomCode, socket]);

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