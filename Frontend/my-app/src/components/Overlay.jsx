import React from 'react';
import '../styles/Overlay.css';

const Overlay = ({ message, onClose }) => {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-message">
        <p>{message}</p>
        <button onClick={onClose} className="overlay-close-button">OK</button>
      </div>
    </div>
  );
};

export default Overlay;
