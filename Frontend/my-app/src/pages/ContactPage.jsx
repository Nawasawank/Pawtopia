import React, { useState } from 'react';
import Navbar from '../components/navbar';
import '../styles/ContactPage.css';
import manydog from '../pictures/manydog.png';
import ContactSection from '../components/ContactSection';
import api from '../api';
import Overlay from '../components/Overlay';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    details: '',
  });
  const [overlayMessage, setOverlayMessage] = useState(''); // For overlay
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { details } = formData;
    const comment = details.trim();

    if (!comment) {
      setOverlayMessage('Please describe the issue.');
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        setOverlayMessage('You need to log in to submit feedback.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await api.post(
        '/api/user/issues',
        {
          feedback_type: 'technical',
          comment,
        },
        { headers }
      );

      if (response.status === 200 || response.status === 201) {
        setOverlayMessage('Thank you for your feedback!');
        setFormData({ details: '' });
      } else {
        setOverlayMessage('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setOverlayMessage(
        error.response?.data?.message || 'An unexpected error occurred. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClose = () => {
    setOverlayMessage(''); // Close the overlay by clearing the message
  };

  return (
    <div className="contact-page">
      <Navbar />
      <main className="contact-content">
        <div className="contact-container">
          <div className="contact-image-section">
            <img src={manydog} alt="Cute Dogs" className="manydog-image" />
          </div>
          <div className="contact-form-section">
            <h1>We're Here to Help!</h1>
            <p>
              If you've encountered any issues while using our website, please let us know. Your feedback helps us improve your experience with Pawtopia!
            </p>
            <form className="contact-form" onSubmit={handleSubmit}>
              <label htmlFor="details">Issue Details</label>
              <textarea
                id="details"
                name="details"
                placeholder="Describe the issue"
                value={formData.details}
                onChange={handleChange}
              ></textarea>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
        <ContactSection />
        {overlayMessage && <Overlay message={overlayMessage} onClose={handleOverlayClose} />}
      </main>
    </div>
  );
};

export default ContactPage;
