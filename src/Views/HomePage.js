import React, { useState } from 'react';
import './HomePage.css';
import TopFold from "./TopFold.js";

const HomePage = () => {
    // const [isBlue, setIsBlue] = useState(false);

    // const toggleColor = () => {
    //     setIsBlue(!isBlue);
    // };

    return (
        <div className="WB-homepage">
            <TopFold/>
        </div>
    );
};

export default HomePage;