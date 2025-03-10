import React from "react";
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <img src="logo surrealista.png" alt="vz" />
            </div>
            <nav className="nav-desktop">
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>   
            </nav>
        </header>
    );
}

export default Header;
