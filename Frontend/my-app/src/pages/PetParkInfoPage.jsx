import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import '../styles/PetParkInfoPage.css';
import star from '../pictures/star.png';
import toyy from '../pictures/toyy.png';
import garden from '../pictures/garden.png';
import playground from '../pictures/playground.png';
import ContactSection from '../components/ContactSection';
import api from '../api';
import Navbar_NotLogin from '../components/navbar_notLogin.jsx';

const PetparkInfoPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const serviceId = 4; 
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
    navigate('/petpark-booking'); // Replace '/petpark-booking' with the actual booking route
  };

  return (
    <div className="park-info-page">
      {/* Navbar */}
      <Navbar />
      {isLoggedIn ? <Navbar /> : <Navbar_NotLogin />}  

      {/* Header Section */}
      <header className="park-header">
        <div className="park-image-container">
          <img src={garden} alt="Garden" className="garden-pic" />
          <img src={playground} alt="Playground" className="playground-icon" />
          <img src={toyy} alt="Toy" className="toyy-icon" />
        </div>
        <div className="park-text-content">
          <h1>
            Unleash the Fun at Pawtopia’s Pet Park!
            <span className="park-subtext">
              Pawtopia Pet Park is a spacious, secure area where pets can run, play, and socialize in a safe, supervised environment. We offer organized playgroups for pets of all sizes and energy levels.
            </span>
          </h1>
          <h2>Services Provided</h2>
          <ul className="park-services-list">
            <li>Off-Leash Play: Fenced-in areas allow pets to run free and explore safely. We offer separate areas for small and large dogs, ensuring everyone has fun.</li>
            <li>Agility Courses: Challenge your pet with agility obstacles like tunnels, ramps, and jumps, helping them stay active and mentally stimulated. </li>
            <li>Socialization Opportunities: Organized playgroups are designed to encourage pets to socialize, play, and learn to interact with other animals in a positive, controlled setting.</li>
            <li>Pet-Friendly Amenities: Water stations, pet-friendly benches, shaded areas, and waste stations throughout the park for convenience.</li>
            <li>Special Events: We host seasonal events such as doggy playdates, pet birthday parties, and fun pet-themed competitions.</li>
          </ul>
          <button className="park-book-now-button" onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      </header>

      {/* Reviews Section */}
      <section className="park-additional-section">
        <h3>Reviews</h3>
        {loading ? (
          <p>Loading feedback...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
            <div className="park-reviews-container">
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
      </section>

      {/* Contact Us Section */}
      <ContactSection />
    </div>
  );
};

export default PetparkInfoPage;