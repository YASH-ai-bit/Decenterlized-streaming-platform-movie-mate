import React, { useState, useEffect } from "react";
import { getContract } from "../Room.js";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./AfterYT.css";

const socket = io("http://localhost:3001", {
  transports: ["websocket"],
});

const AfterYT = ({ closeModal }) => {
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (roomCode) {
      socket.emit("join-board", roomCode);
    }

    // Listen for redirection event
    socket.on("redirect-to-youtube", (data) => {
      console.log(`Redirecting users in room ${data.roomCode} to YouTube page`);
      navigate(`/youtube/${data.roomCode}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomCode, navigate]); // Dependency array ensures it only runs when `roomCode` changes

  // Create Room Handler
  const handleCreateBoard = async () => {
    try {
      setIsCreating(true);
      const contract = await getContract();
      const tx = await contract.createRoom();
      const receipt = await tx.wait();
      const event = receipt.events?.find((event) => event.event === "RoomCreated");

      if (!event) throw new Error("RoomCreated event not found.");

      const generatedRoomCode = event.args?.roomCode;
      if (!generatedRoomCode) throw new Error("Room code not found in event args.");

      setRoomCode(generatedRoomCode);
      alert(`Board created successfully! Code: ${generatedRoomCode}`);
    } catch (error) {
      console.error("Error creating board:", error.message);
      alert("Failed to create board.");
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
      const contract = await getContract();
      const tx = await contract.joinRoom(roomCode);
      await tx.wait();
      alert(`Successfully joined board: ${roomCode}`);
    } catch (error) {
      console.error("Error joining board:", error.message);
      alert("Failed to join board.");
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
