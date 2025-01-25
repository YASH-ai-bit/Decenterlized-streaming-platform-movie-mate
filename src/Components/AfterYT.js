import React from "react";
import "./AfterYT.css";

const AfterYT = ({ closeModal }) => {
  return (
    <div className="after-yt-container">
      <div className="blur-background"></div>
      <div className="modal">
        <h2 className="modal-heading">You<span className="red">Tube</span> - Over the Board!</h2>
        <div className="button-container">
          <button className="btn create-room-btn"><span className="white">Create Board</span></button>
          <div className="join-room">
            <input
              type="text"
              placeholder="Enter Board Code"
              className="room-code-input"
            />
            <button className="btn join-room-btn"><span className="white">Join Board</span></button>
          </div>
        </div>
        {/* Close Button */}
        <button className="btn close-btn" onClick={closeModal}>
        <span className="white">Close</span>
        </button>
      </div>
    </div>
  );
};

export default AfterYT;
