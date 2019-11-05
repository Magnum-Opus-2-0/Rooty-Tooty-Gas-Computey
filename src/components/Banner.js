import React from 'react';
import Header from './Header';
import './styles/Banner.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Banner = () =>  (
    <div>
        <div className="Hero">
            <Router>
                <Header />
            </Router>
            <div className="HeroGroup">
                <div className="HeroSlogan">
                    <h1>It just works.</h1>
                </div>
                <p className="HeroGroupText">Find the cheapest gas right around the corner.</p>
                <sub>Save money by computing your car</sub>
            </div>
        </div>
    </div>
)

export default Banner;
