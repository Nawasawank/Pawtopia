import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Navbar_NotLogin from '../components/navbar_notLogin.jsx'; // Import Navbar_NotLogin
import ContactSection from '../components/ContactSection.jsx';
import api from '../api';
import '../styles/VaccinationInfoPage.css';
import vaccat from '../pictures/vaccat.png';
import add1 from '../pictures/5.png';
import add2 from '../pictures/25.png';
import star from '../pictures/star.png';

const VaccinationInfoPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serviceId = 3; // Service ID for vaccination
  const navigate = useNavigate(); // Initialize navigate
  const isLoggedIn = !!localStorage.getItem('token'); // Check if user is logged in

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get(`/api/getfeedback/${serviceId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFeedback(response.data.feedback);
      } catch (err) {
        setError('Failed to fetch feedback');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Function to handle "Book Now" button click
  const handleBookNow = () => {
    navigate('/booking'); // Replace '/booking' with the actual booking route
  };

  return (
    <div className="vaccination-info-page">
      {isLoggedIn ? <Navbar /> : <Navbar_NotLogin />}  

      <main className="vaccination-content">
        <div className="vaccination-header">
          <div className="image-container">
            <img src={vaccat} alt="Cat Vaccination" className="vaccat-image" />
            <img src={add1} alt="Heart icon" className="heart-icon" />
            <img src={add2} alt="Drug icon" className="drug-icon" />
          </div>

          <div className="text-content">
            <h1>
              Keep Your Pet Healthy<br />
              <span className="subtext">with Vaccination!</span>
            </h1>

            <ul>
              <li><p>Offer a comprehensive range of vaccinations to protect pets from common diseases.</p></li>
              <li><p>Vaccinations are done by certified veterinarians, following the latest schedules for pets.</p></li>
              <li>Core vaccines for dogs and cats, like Rabies and Parvovirus.</li>
              <li>Routine check-ups post-vaccination to monitor pet health.</li>
            </ul>

            <h2 className="left-align">Service Provided</h2>
            <ul>
              <li>Safe, clean environment with well-trained staff.</li>
              <li>Flexible appointment scheduling.</li>
              <li>Detailed post-vaccination care tips and reminders for boosters.</li>
              <li>Full health checkups with each vaccination.</li>
            </ul>

            {/* "Book Now" Button with onClick handler */}
            <button className="book-now-button" onClick={handleBookNow}>Book Now</button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="additional-section">
          <h3>Reviews</h3>
          {loading ? (
            <p>Loading feedback...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="reviews-container">
              {feedback.length > 0 ? (
                feedback.map((review) => (
                  <div key={review.feedback_id} className="review-card">
                    <div className="star-rating">
                      {[...Array(review.rating)].map((_, i) => (
                        <img key={i} src={star} alt="Star" className="star-icon" />
                      ))}
                    </div>
                    <p className="review-content">{review.comment}</p>
                    <p className="review-author">{review.firstname}</p>
                    <p className="review-date">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>No reviews available yet. Be the first to leave a review!</p>
              )}
            </div>
          )}
        </div>

        <ContactSection />
      </main>
    </div>
  );
};

export default VaccinationInfoPage;