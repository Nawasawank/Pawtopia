import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import logo from '../pictures/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css';

function Navbar() {
  // Initialize state for user information
  const [userInfo, setUserInfo] = useState({ firstName: '', image: '' });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');  // Get token from localStorage

      if (!token) return; // No token means no need to fetch profile info

      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Pass token in headers
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Prepend the backend server URL to the image path
          const profileImageUrl = `http://localhost:5000${data.image}`;

          setUserInfo({
            firstName: data.firstName,
            image: profileImageUrl  // Set the full URL for the image
          });
          
          console.log(data);
        } else {
          console.error('Failed to fetch profile info');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="homepage-container">
      <header className="navbar">
        <div className="logo">
          <img src={logo} alt="Pawtopia Logo" />
          <h1>Pawtopia</h1>
        </div>
        <nav>
          <ul>
            <li>
              <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-basic">
                  Services
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#grooming">Grooming</Dropdown.Item>
                  <Dropdown.Item href="#veterinary">Veterinary</Dropdown.Item>
                  <Dropdown.Item href="#vaccination">Vaccination</Dropdown.Item>
                  <Dropdown.Item href="#pet-hotel">Pet Hotel</Dropdown.Item>
                  <Dropdown.Item href="#pet-park">Pet Park</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li><a href="#about">About Us</a></li>
            <li>
              <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-booking">
                  Booking
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="/grooming-booking">Grooming</Dropdown.Item>
                  <Dropdown.Item href="/swimming-booking">Swimming</Dropdown.Item>
                  <Dropdown.Item href="/vaccine-booking">Vaccination</Dropdown.Item>
                  <Dropdown.Item href="/hotel-booking">Pet Hotel</Dropdown.Item>
                  <Dropdown.Item href="/petpark-booking">Pet Park</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#about">History</a></li>
          </ul>
        </nav>
        <div className="user-info">

          <span>Hi! {userInfo.firstName}</span>
          {userInfo.image && <img src={userInfo.image} alt="Profile" className="profile-img" />}
        </div>
      </header>
    </div>
  );
}

export default Navbar;
