import React from 'react';
import '../styles/Overlay.css';

const Issues_Overlay = ({ issue, onClose }) => {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-message" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside */}
        <h3>Issue Details</h3>
        <p><strong>Description:</strong> {issue.issue_description}</p>
        <button onClick={onClose} className="overlay-close-button">Close</button>
      </div>
    </div>
  );
};

export default Issues_Overlay;
