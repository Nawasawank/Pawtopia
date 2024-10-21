import React, { useEffect, useState } from 'react';
import '../styles/Overlay.css';

const Overlay = ({ message, onClose, show }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true); 
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className={`overlay ${show ? 'fade-in' : 'fade-out'}`} onClick={onClose}>
      <div className="overlay-message">
        <p>{message}</p>
        <button onClick={onClose} className="overlay-close-button">OK</button>
      </div>
    </div>
  );
};

export default Overlay;
