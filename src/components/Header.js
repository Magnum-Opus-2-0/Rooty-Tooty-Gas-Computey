import React from 'react';
import './styles/Header.css';
import logo from '../images/Logo.png';
import { Link } from 'react-router-dom';

const Header = () => (
    <div className="Header">
        <div className="LogoContainer">
            <Link to="/"><img src={logo} alt="logo" width="85" /></Link>
            <h4 className="logo">Gas Computey</h4>
        </div>
        <div className="NavLinks">
            <Link to="/findgas" className="NavLink">
                <a>Find Gas</a>
            </Link>
            <Link to="/gasmap" className="NavLink">
                <a>Gas Map</a>
            </Link>
            <Link to="/planyourtrip" className="NavLink">
                <a>Plan Your Trip</a>
            </Link>
        </div>
    </div>
)

export default Header;
