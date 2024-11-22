import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';  
import '../styles/DeveloperSignUpPage.css'; 
import Overlay from '../components/Overlay.jsx'; 

const DeveloperSignUpPage = () => {
  const [developerFirstName, setDeveloperFirstName] = useState('');
  const [developerLastName, setDeveloperLastName] = useState('');
  const [developerEmail, setDeveloperEmail] = useState('');
  const [developerPassword, setDeveloperPassword] = useState('');
  const [developerConfirmPassword, setDeveloperConfirmPassword] = useState('');
  const [overlayMessage, setOverlayMessage] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    // Check if passwords match
    if (developerPassword !== developerConfirmPassword) {
      setOverlayMessage('Passwords do not match');
      setShowOverlay(true);
      return;
    }

    const data = {
      firstname: developerFirstName,
      lastname: developerLastName,
      email: developerEmail,
      password: developerPassword,
    };

    try {
      const response = await api.post('/api/dev/register', data);

      if (response.status === 201) {
        setOverlayMessage('Developer created successfully!');
        setShowOverlay(true);

        setTimeout(() => {
          setShowOverlay(false);
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setOverlayMessage(error.response?.data?.error || 'Error occurred during sign-up');
      setShowOverlay(true);
    }
  };

  const handleOverlayClose = () => {
    setShowOverlay(false);
  };

  return (
    <div className="developer-register-container">
      <h2 className="developer-register-title">Developer Register</h2>
      <form onSubmit={handleSignUp} className="developer-form-container">
        <label className="developer-form-label">First Name</label>
        <input
          className="developer-input"
          type="text"
          placeholder="First Name"
          value={developerFirstName}
          onChange={(e) => setDeveloperFirstName(e.target.value)}
          required
        />
        
        <label className="developer-form-label">Last Name</label>
        <input
          className="developer-input"
          type="text"
          placeholder="Last Name"
          value={developerLastName}
          onChange={(e) => setDeveloperLastName(e.target.value)}
          required
        />
        
        <label className="developer-form-label">Email</label>
        <input
          className="developer-input"
          type="email"
          placeholder="Email"
          value={developerEmail}
          onChange={(e) => setDeveloperEmail(e.target.value)}
          required
        />
        
        <label className="developer-form-label">Password</label>
        <input
          className="developer-input"
          type="password"
          placeholder="Password"
          value={developerPassword}
          onChange={(e) => setDeveloperPassword(e.target.value)}
          required
        />
        
        <label className="developer-form-label">Confirm Password</label>
        <input
          className="developer-input"
          type="password"
          placeholder="Confirm Password"
          value={developerConfirmPassword}
          onChange={(e) => setDeveloperConfirmPassword(e.target.value)}
          required
        />
        
        <button className="developer-submit-button" type="submit">Submit</button>
      </form>

      {/* Overlay component */}
      {showOverlay && (
        <Overlay 
          message={overlayMessage}
          onClose={handleOverlayClose} 
        />
      )}
    </div>
  );
};

export default DeveloperSignUpPage;
