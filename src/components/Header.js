import React from 'react';
import './styles/Header.css';
import logo from '../images/Logo.png';
import { BrowserRouter as Link } from 'react-router-dom';

const Header = () => (
    <div className="Header">
        <div className="LogoContainer">
            <Link to="/"><img src={logo} alt="logo" width="85" /></Link>
            <h4 className="logo">Gas Computey</h4>
        </div>
        <div className="NavLinks">
            <Link to="/"><a href="/"></a>Find Gas</Link>
            <Link to="/"><a href="/"></a>Gas Map</Link>
            <Link to="/"><a href="/"></a>Plan Your Trip</Link>
        </div>
    </div>
)

export default Header;
