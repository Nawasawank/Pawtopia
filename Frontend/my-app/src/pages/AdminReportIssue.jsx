import React, { useState } from 'react';
import '../styles/AdminReportIssue.css'; // Custom CSS for AdminReportIssue
import Navbar from '../components/admin_navbar.jsx'; // Reusing the Admin Navbar
import api from '../api'; // Importing the API abstraction

const AdminReportIssue = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = event.target['issue-title'].value;
    const description = event.target['issue-description'].value;

    if (title && description) {
      try {
        setLoading(true);

        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        // Create the headers object
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // Make the API call with headers
        const response = await api.post(
          '/api/admin/issues',
          {
            issue: title,
            issue_description: description,
            developer_id: 1, // Replace with dynamic developer ID if applicable
            status: 'in_progress', // Default status
          },
          { headers } // Pass headers here
        );

        alert('Issue submitted successfully!');
        console.log('API Response:', response.data);
      } catch (error) {
        console.error('Error submitting issue:', error);
        alert(
          `Failed to submit issue: ${
            error.response?.data?.error || 'Unknown error'
          }`
        );
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <div className="admin-report-issue-container">
      <Navbar />
      <div className="admin-report-issue-content">
        {/* Form Section */}
        <div className="report-issue-form-section">
          <h1>Report an Issue</h1>
          <form className="report-issue-form" onSubmit={handleSubmit}>
            <label htmlFor="issue-title">Issue:</label>
            <input
              type="text"
              id="issue-title"
              placeholder="Enter a brief title for the issue"
            />

            <label htmlFor="issue-description">Issue Details:</label>
            <textarea
              id="issue-description"
              rows="5"
              placeholder="Provide a detailed description of the issue"
            ></textarea>

            <button type="submit" className="submit-issue-button" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Issue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminReportIssue;