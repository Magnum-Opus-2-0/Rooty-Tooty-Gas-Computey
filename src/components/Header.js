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
                <NavbarBrand href="/">
                    Rooty Tooty Gas Computey
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink href="/find">Find</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/caroptions">Car Options</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}


export default Header;
