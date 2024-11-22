import React, { useState, useEffect } from 'react';
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import api from '../api';
import '../styles/issuesPage.css';
import Issues_Overlay from '../components/Issues_Overlay.jsx';
import DeveloperNavbar from '../components/dev_navbar.jsx';

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Set default to today's date
  const [statusUpdates, setStatusUpdates] = useState({});
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentIssue, setCurrentIssue] = useState(null);

  useEffect(() => {
    fetchIssues(new Date()); // Fetch issues for today by default
  }, []);

  const fetchIssues = async (date = null) => {
    try {
      let query = '';
      if (date) {
        // Format the date as YYYY-MM-DD in local time
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        query = `?date=${formattedDate}`;
      }
  
      const response = await api.get(`/api/dev/issues${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIssues(response.data.issues || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  const handleStatusChange = (issueId, newStatus) => {
    setStatusUpdates({
      ...statusUpdates,
      [issueId]: newStatus,
    });
  };

  const handleSave = async () => {
    const updatePromises = Object.entries(statusUpdates).map(([issueId, status]) =>
      api.put('/api/dev/issues/update', { issue_id: issueId, status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response)
        .catch((error) =>
          console.error(`Failed to update issue ${issueId}:`, error.response?.data || error)
        )
    );

    try {
      await Promise.all(updatePromises);
      alert('Statuses updated successfully');
      setStatusUpdates({});
      fetchIssues(selectedDate); // Refresh issues
    } catch (error) {
      console.error('Error updating statuses:', error);
      alert('Failed to update statuses');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchIssues(date);
  };

  const handleIssueClick = (issue) => {
    setCurrentIssue(issue);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setCurrentIssue(null);
  };

  return (
    <div className="issues-page-wrapper">
      <DeveloperNavbar />
      <h1 className="issues-title">Reported Issues</h1>
      <div className="filter-section">
        <label>Select Date:</label>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          format="yyyy-MM-dd"
          style={{ width: 250 }}
        />
      </div>
      <table className="issues-table">
        <thead>
          <tr>
            <th>Issue ID</th>
            <th>Issue</th>
            <th>Reported By</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {issues.length > 0 ? (
            issues.map((issue) => (
              <tr key={issue.issue_id} onClick={() => handleIssueClick(issue)}>
                <td>{issue.issue_id}</td>
                <td>{issue.issue}</td>
                <td>{`Admin ${issue.employee_id}`}</td>
                <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                <td>
                  <select
                    value={statusUpdates[issue.issue_id] || issue.status}
                    onChange={(e) => handleStatusChange(issue.issue_id, e.target.value)}
                    onClick={(e) => e.stopPropagation()} // Prevent overlay on select change
                  >
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No issues found</td>
            </tr>
          )}
        </tbody>
      </table>
      {issues.length > 0 && (
        <div className="save-button-container">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
      {showOverlay && currentIssue && (
        <Issues_Overlay
          issue={currentIssue}
          onClose={closeOverlay}
        />
      )}
    </div>
  );
};

export default IssuesPage;
