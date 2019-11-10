import React from 'react';
import './styles/Header.css';
import logo from '../images/Logo.png';
import styled from 'styled-components';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
// import { Link } from 'react-router-dom';
// PLEASE DON'T DELETE THIS YET

// const Header = () => (
//     <div className="Header">
//         <div className="LogoContainer">
//             <Link to="/"><img src={logo} alt="logo" width="85" /></Link>
//             <h4 className="logo">Gas Computey</h4>
//         </div>
//         <div className="NavLinks">
//             <Link to="/findgas" className="NavLink">
//                 <a>Find Gas</a>
//             </Link>
//             <Link to="/gasmap" className="NavLink">
//                 <a>Gas Map</a>
//             </Link>
//             <Link to="/planyourtrip" className="NavLink">
//                 <a>Plan Your Trip</a>
//             </Link>
//         </div>
//     </div>
// )
// const Styles = styled.div`
//     .navbar {
//         background-color: black;
//     }

//     .navlink {
//         color: white;

//         &:hover {
//             color: blue;
//         }
//     }
// `;



const Header = (props) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar className="navbar-dark bg-dark" light expand="lg">
                <NavbarBrand
                    href="/"
                >
                    Rooty Tooty Gas Computey
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink href="/findgas">Find Gas</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/gasmap">Gas Map</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/planyourtrip">Plan Your Trip</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}


export default Header;
