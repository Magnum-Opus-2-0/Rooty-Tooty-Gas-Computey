import React from 'react';
import Header from './Header';
import './styles/Banner.css';

const Banner = () =>  (
    <div className="Hero">
        <Header />
        <div className="HeroGroup">
            <div className="HeroSlogan">
                <h1>It just works.</h1>
            </div>
            <p className="HeroGroupText">Find the cheapest gas right around the corner.</p>
            <sub className="HeroGroupText2">Save money by computing your car</sub>
        </div>
    </div>
)

export default Banner;
