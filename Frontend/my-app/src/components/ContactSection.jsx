import React from 'react';
import facebook from '../pictures/facebook.png';
import ig from '../pictures/ig.png';
import line from '../pictures/line.png';
import '../styles/ContactSection.css';

const ContactSection = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-cont">
        <div className="contact-info">
          <h4>Contact Us</h4>
          <p>
            Sirindhorn International Institute of Technology,<br />
            Thammasat University - Rangsit Campus<br />
            99 Moo 18, Km. 41 on Paholyothin Highway Khlong Luang, Pathum Thani 12120, Thailand<br />
            Tel: +66 2-986 9009-13<br />
            Fax: +66 2-986 9112-3
          </p>
        </div>
        <div className="social-links">
          <a href="https://www.facebook.com">
            <img src={facebook} alt="Facebook" className="social-icon" /> Pawtopia Pet Care
          </a>
          <a href="https://www.instagram.com">
            <img src={ig} alt="Instagram" className="social-icon" /> @Pawtopia Pet Care
          </a>
          <a href="https://line.me">
            <img src={line} alt="Line" className="social-icon" /> Pawtopia Pet Services
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
