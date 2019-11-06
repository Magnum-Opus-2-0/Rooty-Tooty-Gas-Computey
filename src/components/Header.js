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
            <Link to="/findgas">Find Gas</Link>
            <Link to="/gasmap">Gas Map</Link>
            <Link to="/planyourtrip">Plan Your Trip</Link>
        </div>
    </div>
)

export default Header;
