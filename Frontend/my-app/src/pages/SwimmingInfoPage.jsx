// swimming.jsx   
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import '../styles/SwimmingInfoPage.css';
import swimmingdog from '../pictures/swimmingdog.png';
import smallpaw from '../pictures/smallpaw.png';
import bigpaw from '../pictures/bigpaw.png';
import star from '../pictures/star.png';
import dogcat from '../pictures/dogcat.png';
import ContactSection from '../components/ContactSection';
import api from '../api';
import Navbar_NotLogin from '../components/navbar_notLogin.jsx';

const SwimmingInfoPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serviceId = 2; // Service ID for swimming
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token'); 


  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get(`/api/getfeedback/${serviceId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Token retrieved from local storage
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
    navigate('/swimming-booking'); // Replace '/swimming-booking' with the actual booking route
  };

  return (
    <div className="swimming-info-page">
      {/* Navbar */}
      {isLoggedIn ? <Navbar /> : <Navbar_NotLogin />}  

      {/* Page content */}
      <main className="swimming-content">
        <div className="swimming-header">
          {/* Image Section */}
          <div className="swim-image-container">
            <img src={swimmingdog} alt="Dog Swimming" className="swimmingdog-image" />
            <img src={smallpaw} alt="Small Paw Icon" className="smallpaw-icon" />
            <img src={bigpaw} alt="Big Paw Icon" className="bigpaw-icon" />
            <img src={dogcat} alt="Dog Cat Icon" className="dogcat-icon" />
          </div>

          {/* Text Content Section */}
          <div className="swim-text-content">
            <h1>
              Dive Into Fun with Our Pet <br />
              <span className="swim-subtext">Swimming Pool!</span>
            </h1>
            <p className="swim-intro-text">
              <span className="swim-highlight">Pawtopia offers a clean and safe</span> swimming pool where pets can enjoy recreational swimming or undergo hydrotherapy for recovery and rehabilitation. Swimming is a low-impact exercise that helps pets with joint problems or obesity, or those in need of post-surgery physical therapy.
            </p>

            <h2 className="swim-service-title">Services Provided</h2>
            <ul className="swim-services-list">
              <li>
                <span className="swim-highlight">Hydrotherapy: </span> Special sessions designed for pets recovering from surgery or suffering from arthritis, joint issues, or obesity. This non-weight-bearing exercise promotes healing and mobility.
              </li>
              <li>
                <span className="swim-highlight">Private Sessions: </span> Private swimming sessions available for pets who prefer a quieter environment or for those with behavioral challenges around other animals.
              </li>
              <li>
                <span className="swim-highlight">Swim Lessons: </span> For dogs who have never swum before, we offer beginner swim lessons, helping your dog become comfortable and confident in the water.
              </li>
            </ul>

            <button className="swim-book-now-button" onClick={handleBookNow}>Book Now</button>
          </div>
        </div>

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
          <div key={review.feedback_id} className="groom-review-card">
            <div className="groom-star-rating">
              {[...Array(review.rating)].map((_, i) => (
                <img key={i} src={star} alt="Star" className="groom-star-icon" />
              ))}
            </div>
            <div className="groom-review-content">{review.comment}</div>
            <div className="groom-review-author">{review.firstname}</div>
            <div className="groom-review-date">
              {new Date(review.created_at).toLocaleDateString()}
            </div>
          </div>
        ))
      ) : (
        <p>No reviews available at the moment.</p>
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

export default SwimmingInfoPage;