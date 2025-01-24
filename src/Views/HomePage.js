import React, { useState } from 'react';
import './HomePage.css';
import Header from "./header.js";

const HomePage = () => {
    const [isBlue, setIsBlue] = useState(false);

    const toggleColor = () => {
        setIsBlue(!isBlue);
    };

    return (
        <div className="WB-homepage">
            <Header/>
        </div>
    );
};

export default HomePage;