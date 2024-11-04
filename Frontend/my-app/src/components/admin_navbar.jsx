import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../pictures/logo.png';
import '../styles/Navbar.css';
import api from '../api';

function AdminNavbar() {
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchAdminName = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await api.get('/admin_name', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 200) {
          setName(response.data.name);
        }
      } catch (error) {
        console.error('Error fetching admin name:', error);
      }
    };

    fetchAdminName();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/admin-dashboard">
          <img src={logo} alt="Pawtopia Logo" />
          <h1>Pawtopia</h1>
        </Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/employee">Employee</Link></li>
          <li><Link to="/booking">Booking</Link></li>
          <li><Link to="/client">Client</Link></li>
          <li><Link to="/feedback">Feedback</Link></li>
          <li><Link to="/report">Report</Link></li>
        </ul>
      </nav>
      <div className="user-info">
        <span>Hi! {name}</span>
        <button onClick={handleLogout} className="logout-button">Log Out</button>
      </div>
    </header>
  );
}

export default AdminNavbar;
