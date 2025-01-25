import React from "react";
import BGVideo from "../assets/videos/All_Intros.mp4";
import "./AfterClickingYT.css";

const AfterClickingYT = () => {
  return (
    <div className="popup-container">
      <div className="popup-background">
      </div>
      <div className="popup-content">
        <h1>Choose Your Action</h1>
        <div className="popup-buttons">
          <div className="create-room">
            <button className="btn">Create Room</button>
          </div>
          <div className="room-code-input">
            <input 
              type="text" 
              placeholder="Enter Room Code" 
              className="room-code-input-field"
            />
            <button className="btn">Join Room</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterClickingYT;
