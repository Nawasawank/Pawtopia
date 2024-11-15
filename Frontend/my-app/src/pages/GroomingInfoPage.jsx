import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import '../styles/GroomingInfoPage.css';
import star from '../pictures/star.png';
import comb from '../pictures/comb.png';
import doggroom from '../pictures/doggroom.png';
import takecare from '../pictures/takecare.png';
import ContactSection from '../components/ContactSection';
import api from '../api';
import Navbar_NotLogin from '../components/navbar_notLogin.jsx';

const GroomingInfoPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serviceId = 1; 
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token'); 

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

  const handleBookNow = () => {
    navigate('/grooming-booking'); // Replace with the actual booking route
  };

  return (
    <div className="grooming-info-page">
      {/* Navbar */}
      {isLoggedIn ? <Navbar /> : <Navbar_NotLogin />}  

      {/* Page content */}
      <main className="grooming-content">
        <div className="grooming-header">
          {/* Image Section */}
          <div className="groom-image-container">
            <img src={takecare} alt="Take Care Icon" className="takecare-icon" />
            <img src={comb} alt="Comb Icon" className="comb-icon" />
            <img src={doggroom} alt="Dog Groom Icon" className="doggroompic" />
          </div>

          {/* Text Content Section */}
          <div className="groom-text-content">
            <h1>
              Professional Pet Grooming,<br />
              <span className="groom-subtext">Keep Your Pet Looking &</span>
              <span className="groom-subtext">Feeling Their Best </span>
            </h1>

            <h2 className="groom-highlight">Services Provided</h2>
            <ul className="groom-services-list">
              <li>De-shedding Treatments: Specialized treatments to reduce shedding, ideal for long-haired or double-coated breeds.</li>
              <li>Flea and Tick Treatments: Gentle, effective treatments that eliminate pests while keeping your pet’s skin healthy.</li>
              <li>Sensitive Skin and Allergy Care: Use of hypoallergenic shampoos and conditioners for pets with skin sensitivities or allergies.</li>
              <li>Add-On Services: Teeth brushing, nail polish, fragrance sprays, and bow/bandana accessories for the perfect finishing touch.</li>
            </ul>
            <p className="groom-intro-text">
              At Pawtopia, grooming is more than just keeping your pet looking good. It’s also about maintaining their overall health and well-being. Our certified groomers specialize in providing stress-free grooming experiences tailored to the needs of each pet.
            </p>

            <button className="groom-book-now-button" onClick={handleBookNow}>Book Now</button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="groom-additional-section">
          <h3>Reviews</h3>
          {loading ? (
            <p>Loading feedback...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="groom-reviews-container">
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
        {/* Contact Us Section */}
        <ContactSection />
      </main>
    </div>
  );
};

export default GroomingInfoPage;