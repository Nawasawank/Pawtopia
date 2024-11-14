import React from 'react';
import '../styles/AdminHomePage.css'; // Custom CSS for styling
import Navbar from '../components/admin_navbar.jsx';
import Dalmatian from '../pictures/Dalmatian.png';
import { useNavigate } from 'react-router-dom';

const AdminHomePage = () => {
    const navigate = useNavigate(); 
  return (

    <div className="admin-home-container">
      <Navbar />
      <div className="admin-home-content">
      <div className="admin-image-section">
          <img
            src={Dalmatian} 
            alt="Admin Dog"
            className="admin-dog-image"
          />
        </div>
        <div className="admin-welcome-section">
          <h1>Welcome Admin</h1>
          <div className="management-buttons">
          <button onClick={() => navigate('/employee')}>Employee Management</button>
            <button onClick={() => navigate('/booking')}>Booking Management</button>
            <button onClick={() => navigate('/client')}>Client Management</button>
            <button onClick={() => navigate('/feedback')}>Feedback Management</button>
            <button onClick={() => navigate('/report')}>Report Issue</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
