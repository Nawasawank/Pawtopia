import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/admin_navbar.jsx';
import api from '../api';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import '../styles/FeedbackManagement.css';

const FeedbackManagementPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackType, setFeedbackType] = useState('General');
  const [dateRange, setDateRange] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 6;

  const fetchFeedbacks = async (startDate, endDate) => {
    try {
      const response = await api.get('/api/feedback', {
        params: {
          type: feedbackType,
          startDate: startDate,
          endDate: endDate,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFeedbacks(response.data.feedback || []);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setFeedbacks([]);
    }
  };

  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].toISOString().split('T')[0];
      const endDate = dateRange[1].toISOString().split('T')[0];
      fetchFeedbacks(startDate, endDate);
    }
  }, [feedbackType, dateRange]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);

  const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);

  return (
    <div className="feedback-management-container">
      <Navbar />

      <h1 className="page-title">Feedback Management</h1>

      <div className="filter-container">
        <div className="filter-item">
          <label>Type of Feedback</label>
          <select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)}>
            <option value="General">General</option>
            <option value="Technical">Technical Issue</option>
          </select>
        </div>

        <div className="filter-item">
          <label>Select Date Duration</label>
          <DateRangePicker
            format="dd MMM yyyy"
            value={dateRange}
            onChange={setDateRange}
            placeholder="Select date range"
            size="md"
          />
        </div>
      </div>

      <div className="feedback-cards-container">
        {currentFeedbacks.map((feedback) => (
          <div className="feedback-card" key={feedback.feedback_id}>
            <div className="stars">
              {Array.from({ length: feedback.rating || 0 }, (_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} style={{ color: "#FFD43B" }} />
              ))}
            </div>
            <blockquote>{feedback.comment}</blockquote>
            <p className="feedback-author">- {feedback.firstName || 'Anonymous'}</p>
            <p className="feedback-date">{new Date(feedback.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <a
            key={i + 1}
            href="#"
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i + 1);
            }}
          >
            {i + 1}
          </a>
        ))}
      </div>
    </div>
  );
};

export default FeedbackManagementPage;
