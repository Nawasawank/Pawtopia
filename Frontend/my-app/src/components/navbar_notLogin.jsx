import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import logo from '../pictures/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/navbar_notLogin.css';

function Navbar_NotLogin() {
  return (
    <div className="homepage-container">
      <header className="navbar">
        <div className="logo">
          <Link to="/home">
            <img src={logo} alt="Pawtopia Logo" />
            <h1>Pawtopia</h1>
          </Link>
        </div>
        <nav>
          <ul>
            <li>
              <Dropdown>
              <Dropdown.Toggle variant="link" id="dropdown-basic">
                  Services
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="/grooming">Grooming</Dropdown.Item>
                  <Dropdown.Item href="/swimming">Swimming</Dropdown.Item>
                  <Dropdown.Item href="/vaccine">Vaccination</Dropdown.Item>
                  <Dropdown.Item href="/petpark">Pet Park</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li><a href="/aboutus">About Us</a></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <Link to="/login" className="auth-button login-button">Log in</Link>
          <Link to="/signup" className="auth-button register-button">Register</Link>
        </div>
      </header>
    </div>
  );
}

export default Navbar_NotLogin;
