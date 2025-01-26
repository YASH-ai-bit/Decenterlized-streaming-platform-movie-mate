import React, { useState } from "react";
import WBLogo from "../assets/images/logo512_inverted.png";
import WBSign from "../assets/images/WB-sign-v1.png";
import searchicon from "../assets/images/SearchIcon.png";
import carticon from "../assets/images/StoreIcon.png";
import video from "../assets/videos/All_Intros.mp4";
import Netflix from "../assets/images/Netflixlogo.png";
import Prime from "../assets/images/Primelogo.png";
import YouTube from "../assets/images/YouTubelogo.png";
import Spotify from "../assets/images/Spotifylogo.png";
import HBO from "../assets/images/HBOlogo.png";
import Hulu from "../assets/images/Hululogo.png";
import DisneyHotstar from "../assets/images/DisneyHotstarlogo.png";
import AfterYT from "../Components/AfterYT";
import "./TopFold.css";

const TopFold = () => {
  const [showModal, setShowModal] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

  const handleYouTubeClick = () => {
    setShowModal(true); // Show the modal
    setIsBlurred(true);  // Apply blur effect to the background
  };

  const closeModal = () => {
    setShowModal(false);  // Close the modal
    setIsBlurred(false);  // Remove the blur effect
  };

  return (
    <div className={`topfold ${isBlurred ? "blur" : ""}`}>
      <header className="header">
        <div className="header-left">
          <img src={WBLogo} alt="WhiteBoard Logo" className="logo" />
          <span className="brand-slogan">
            Watch <span className="highlight">Anywhere</span> and with{" "}
            <span className="highlight">Anyone</span>.
          </span>
        </div>
        <nav className="header-nav">
          <ul>
            <li><a href="#store">Store</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#support">Support</a></li>
            <li><a href="#search"><img src={searchicon} alt="Search" className="icon" /></a></li>
            <li><a href="#cart"><img src={carticon} alt="Cart" className="icon" /></a></li>
          </ul>
        </nav>
      </header>

      <div className="main-content">
        <div className="video-section">
          <video src={video} autoPlay loop muted className="video-player" alt="AI Video" />
        </div>

        <div className="text-content">
          <h3 className="logo-grid-title">WATCH WITH FRIENDS</h3>
          <h1>A new way to <span className="highlight-red">watch together</span>.</h1>
          <p>
            WhiteBoard is a new way to watch TV with your friends online.
            <br></br><br></br>
            WhiteBoard offers a decentralized platform for streaming your favorite content.
            <br></br><br></br>
            Sync with friends across Netflix, YouTube, Prime Video, and more, securely
            through blockchain technology.<br></br><br></br>
          </p>
          <button className="cta-button">Learn More</button>
        </div>
      </div>

      <div className="logo-grid-section">
        <h3 className="logo-grid-title">Host a Watch Party on:</h3>
        <div className="logo-grid">
          <img
            src={YouTube}
            alt="YouTube"
            className="logo-grid-item youtube"
            onClick={handleYouTubeClick} // Handle click on YouTube logo
          />
          <img src={Netflix} alt="Netflix" className="logo-grid-item netflix" />
          <img src={DisneyHotstar} alt="Disney Hotstar" className="logo-grid-item disney" />
          <img src={HBO} alt="HBO" className="logo-grid-item hbo" />
          <img src={Hulu} alt="Hulu" className="logo-grid-item hulu" />
          <img src={Prime} alt="Prime Video" className="logo-grid-item prime" />
          <img src={Spotify} alt="Spotify" className="logo-grid-item spotify" />
        </div>
      </div>

      {/* Conditional Rendering of Modal */}
      {showModal && <AfterYT closeModal={closeModal} />}
    </div>
  );
};

export default TopFold;
