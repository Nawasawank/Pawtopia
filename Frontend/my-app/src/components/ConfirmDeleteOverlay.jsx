// ConfirmDeleteOverlay.jsx
import React from 'react';
import '../styles/ConfirmDeleteOverlay.css';

const ConfirmDeleteOverlay = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-delete-overlay">
      <div className="confirm-delete-content">
        <p>{message}</p>
        <div className="confirm-delete-buttons">
          <button onClick={onConfirm} className="confirm-button">Yes</button>
          <button onClick={onCancel} className="cancel-button">No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteOverlay;
