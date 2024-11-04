import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import logo from '../pictures/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css';
import api from '../api';
import { Link } from 'react-router-dom';

function Navbar() {
  const [userInfo, setUserInfo] = useState({ firstName: '', image: '' });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');  

      if (!token) return; 

      try {
        const response = await api.get('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,  
          },
        });

        if (response.status === 200) {
          const data = response.data;
          const profileImageUrl = `${api.defaults.baseURL}${data.image}`;

          setUserInfo({
            firstName: data.firstName,
            image: profileImageUrl
          });
        } else {
          console.error('Failed to fetch profile info');
        }
      } catch (error) {
        console.error('Error fetching profile info:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/login'; 
  };

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
                  <Dropdown.Item href="/petpark-booking">Pet Park</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="/history">History</a></li>
          </ul>
        </nav>
        <div className="user-info">
          <span>Hi! {userInfo.firstName}</span>
          <Dropdown align="end">
            <Dropdown.Toggle as="div" className="profile-img-dropdown" bsPrefix="custom-profile-dropdown">
              {userInfo.image && <img src={userInfo.image} alt="Profile" className="profile-img" />}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.ItemText>
              <div className="profile-info">
                  <Link to="/profile" className="profile-link">
                    <strong>Profile</strong>
                  </Link>
                </div>
              </Dropdown.ItemText>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="logout-button">Log Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
