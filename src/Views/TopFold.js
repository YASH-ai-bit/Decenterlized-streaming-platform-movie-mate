import React from "react";
import WBLogo from "../assets/images/logo512_inverted.png";
import WBSign from "../assets/images/WB-sign-v1.png";
import searchicon from "../assets/images/SearchIcon.png";
import carticon from "../assets/images/StoreIcon.png";
import "./TopFold.css";

const TopFold = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={WBLogo} alt="WhiteBoard Logo" className="logo" />
        <span className="brand-slogan">
          Watch <span className="highlight">Anywhere</span> and with <span className="highlight">Anyone</span>.
        </span>
      </div>
      <nav className="header-nav">
        <ul>
          <li><a href="#store">Store</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#support">Support</a></li>
          <li>
            <a href="#search">
              <img src={searchicon} alt="Search" className="icon" />
            </a>
          </li>
          <li>
            <a href="#cart">
              <img src={carticon} alt="Cart" className="icon" />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default TopFold;
