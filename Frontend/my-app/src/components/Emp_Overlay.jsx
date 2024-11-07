import React, { useState, useEffect } from 'react';
import '../styles/employee_overlay.css';

const Emp_Overlay = ({ title, employee = {}, onClose, onSubmit }) => {
  const [firstName, setFirstName] = useState(employee.firstName || '');
  const [lastName, setLastName] = useState(employee.lastName || '');
  const [email, setEmail] = useState(employee.email || '');
  const [service, setService] = useState(employee.service || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      first_name: firstName,
      last_name: lastName,
      email: email,
      service_id: service 
    });
  };

  return (
    <div className="emp_overlay">
      <div className="emp_overlay-content">
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          >
            <option value="">-- Select a Service --</option>
            <option value="1">Grooming</option>
            <option value="2">Swimming</option>
            <option value="3">Vaccination</option>
            <option value="4">Pet Park</option>
          </select>

          <button type="submit">Submit</button>
        </form>
        <button className="emp_overlay-close-button" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
};

export default Emp_Overlay;
