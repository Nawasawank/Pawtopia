import React from 'react';
import Navbar from '../components/navbar.jsx';
import ContactSection from '../components/ContactSection.jsx';
import '../styles/AboutUsPage.css'; // Custom CSS for the About Us page
import yellow from '../pictures/yellow.png';
import clinic from '../pictures/clinic.png';
import pa1 from '../pictures/pa1.png';
import pa2 from '../pictures/pa1.png'; // Corrected import for pa2

const AboutUsPage = () => {
  return (
    <div className="about-us-page">
      <Navbar />

      <main className="about-us-content">
        {/* Header Section */}
        <header className="about-us-header">
          <div className="about-us-image-container">
            <img src={clinic} alt="Clinic Image" className="about-us-image" />
          </div>

          <div className="about-us-text-content">
            <div className="small-images-container">
              <img src={pa1} alt="Pet Care 1" className="about-us-image2" />
              <h1 className="about-us-heading">About Us</h1>
              <img src={pa2} alt="Pet Care 2" className="about-us-image3" />
            </div>

            <p>
              At Pawtopia, we believe that pets are family, and we are committed to providing the highest level of care to your furry companions. Our experienced and compassionate team offers a wide range of services to ensure your pets stay happy, healthy, and safe. From comprehensive veterinary care and wellness check-ups to grooming and pet hotel services, we treat each pet with the love and attention they deserve.
            </p>
            <p>
              Our mission is simple: to create a haven where pets are cared for like family, and their health and well-being are our top priorities. Whether it's routine vaccinations, dental care, or a cozy stay at our pet hotel, you can trust that your pets are in capable, caring hands.
            </p>
            <p>
              With years of experience and a deep love for animals, Pawtopia is dedicated to providing personalized care tailored to your pet’s unique needs. We believe in clear communication with pet parents, educating them about their pet’s health, and ensuring every visit is stress-free and pleasant.
            </p>
          </div>
        </header>

        {/* Why Choose Us Section */}
        <section className="why-choose-us-section">
          <div className="why-choose-us-image-container">
            <img src={yellow} alt="Playful Pets" className="why-choose-us-image" />
          </div>
          <div className="why-choose-us-text-content">
            <h2>Why Choose Us?</h2>
            <ul>
              <li>Highly Trained Team: Our team is made up of experienced professionals who are passionate about pet care.</li>
              <li>Comprehensive Services: From veterinary services to luxury boarding and grooming, we’ve got everything your pet needs under one roof.</li>
              <li>Pet-Centered Approach: We focus on making sure your pet feels safe, loved, and well-cared for during every visit.</li>
              <li>State-of-the-Art Facility: Our modern, fully equipped clinic ensures that your pet receives the best possible care.</li>
              <li>At Pawtopia Pet Care, your pet’s health and happiness are our number one priority. We look forward to welcoming you and your pet to our family!</li>
            </ul>
          </div>
        </section>

        <ContactSection />
      </main>
    </div>
  );
};

export default AboutUsPage;