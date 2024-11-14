import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';  
import '../styles/AdminSignUpPage.css'; 
import Overlay from '../components/Overlay'; 

const AdminSignUpPage = () => {
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const [successMessage, setSuccessMessage] = useState('');
  const [showOverlay, setShowOverlay] = useState(false); 

  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    // Check if passwords match
    if (adminPassword !== adminConfirmPassword) {
      setErrorMessage('Passwords do not match');
      setShowOverlay(true); 
      return;
    }

    const data = {
      firstname: adminFirstName,
      lastname: adminLastName,
      email: adminEmail,
      password: adminPassword,
    };

    try {
      const response = await api.post('/api/admin/register', data);


      if (response.status === 201) {
        setSuccessMessage('Admin created successfully!');
        setShowOverlay(true); 
        setTimeout(() => {
          navigate('/login'); 
        }, 2000);
      }
    } catch (error) {

      setErrorMessage(error.response?.data?.error || 'Error occurred during sign-up');
      setShowOverlay(true); 
    }
  };

  const handleOverlayClose = () => {
    setShowOverlay(false); 
  };

  return (
    <div className="admin-register-container">
      <h2 className="admin-register-title">Admin Register</h2>
      <form onSubmit={handleSignUp} className="admin-form-container">
        <label className="admin-form-label">First Name</label>
        <input
          className="admin-input"
          type="text"
          placeholder="First Name"
          value={adminFirstName}
          onChange={(e) => setAdminFirstName(e.target.value)}
          required
        />
        
        <label className="admin-form-label">Last Name</label>
        <input
          className="admin-input"
          type="text"
          placeholder="Last Name"
          value={adminLastName}
          onChange={(e) => setAdminLastName(e.target.value)}
          required
        />
        
        <label className="admin-form-label">Email</label>
        <input
          className="admin-input"
          type="email"
          placeholder="Email"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          required
        />
        
        <label className="admin-form-label">Password</label>
        <input
          className="admin-input"
          type="password"
          placeholder="Password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          required
        />
        
        <label className="admin-form-label">Confirm Password</label>
        <input
          className="admin-input"
          type="password"
          placeholder="Confirm Password"
          value={adminConfirmPassword}
          onChange={(e) => setAdminConfirmPassword(e.target.value)}
          required
        />
        
        <button className="admin-submit-button" type="submit">Submit</button>
      </form>

      <Overlay 
        message={errorMessage || successMessage}  
        onClose={handleOverlayClose} 
        show={showOverlay} 
      />
    </div>
  );
};

export default AdminSignUpPage;
