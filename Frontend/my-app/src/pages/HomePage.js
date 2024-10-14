import React from 'react';
import Navbar from './Navbar.js';
import '../components/HomePage.css';
import dog from '../pictures/dog_home.png';
import hotel from '../pictures/hotel.png'
import vaccine from '../pictures/vaccine.png'
import petpark from '../pictures/petpark.png'
import grooming from '../pictures/grooming.png'
import swimming from '../pictures/swimming.png'
import cat from '../pictures/cat.png'
import line from '../pictures/line.png'
import facebook from '../pictures/facebook.png'
import ig from '../pictures/ig.png'
import paw1 from '../pictures/paw1.png';
import paw2 from '../pictures/paw2.png';
import paw3 from '../pictures/paw3.png';
import paw4 from '../pictures/paw4.png';
import paw5 from '../pictures/paw5.png';

const HomePage = () => {
    return (
        
        <div className="homepage-container">
            <Navbar />
            <img src={paw1} alt="Paw Print" className="paw-image paw-image-1" />
            <img src={paw2} alt="Paw Print" className="paw-image paw-image-2" />
            <img src={paw3} alt="Paw Print" className="paw-image paw-image-3" />
            <img src={paw4} alt="Paw Print" className="paw-image paw-image-4" />
            <img src={paw5} alt="Paw Print" className="paw-image paw-image-5" />
            <section className="hero-section">
                <div className="hero-content">
                    <h2>"A Lifetime of Health and Happiness for Your Pet"</h2>
                    <p>Loving Care for Every Paw</p>
                </div>
                <div className="hero-image">
                    <img src={dog} alt="Pet and Owner" />
                </div>
            </section>

            <section id="services" className="services-section">
                <h2 className="services-title">Services</h2> 
                <div className="service-cards">
                    <div className="service-card">
                        <img src={hotel} alt="Hotel" className="hotel-img" />
                        <p>Hotel</p>
                    </div>
                    <div className="service-card">
                        <img src={vaccine} alt="Vaccination" className="vaccine-img" />
                        <p>Vaccination</p>
                    </div>
                    <div className="service-card">
                        <img src={petpark} alt="Pet Park" className="petpark-img" />
                        <p>Pet Park</p>
                    </div>
                    <div className="service-card">
                        <img src={grooming} alt="Grooming" className="grooming-img" />
                        <p>Grooming</p>
                    </div>
                    <div className="service-card">
                        <img src={swimming} alt="Swimming" className="swimming-img" />
                        <p>Swimming</p>
                    </div>
                </div>
            </section>

            <section className="cat-section">
                <div className="cat-container">
                    <div className="cat-image">
                        <img src={cat} alt="Happy Cat" />
                    </div>
                    <div className="cat-text">
                        <h3>Expert Care, Compassionate Hands</h3>
                        <p>At Pawtopia, our team of veterinarians and staff are not only highly experienced but also deeply passionate about the well-being of every pet that walks through our doors. With years of professional training and hands-on experience in veterinary care, we pride ourselves on delivering the highest quality medical attention for your furry family members.</p>
                    </div>
                </div>
            </section>


            <section id="contact" className="contact-section">
                <div className="contact-container">
                    <div className="contact-info">
                        <h4>Contact Us</h4>
                        <p>Sirindhorn International Institute of Technology,<br />
                            Thammasat University - Rangsit Campus<br />
                            99 Moo 18, Km. 41 on Paholyothin Highway Khlong Luang, Pathum Thani 12120, Thailand<br />
                            Tel: +66 2-986 9009-13<br />
                            Fax: +66 2-986 9112-3
                        </p>
                    </div>
                    <div className="social-links">
                        <a href="https://www.facebook.com" >
                            <img src={facebook} alt="Facebook" className="social-icon" /> Pawtopia Pet Care
                        </a>
                        <a href="https://www.instagram.com" >
                            <img src={ig} alt="Instagram" className="social-icon" /> @Pawtopia Pet Care
                        </a>
                        <a href="https://line.me">
                            <img src={line} alt="Line" className="social-icon" /> Pawtopia Pet Services
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
