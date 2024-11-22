import React from 'react';
import '../styles/PetOverlay.css';

const PetOverlay = ({ clientName, pets, onClose }) => {
  return (
    <div className="pet-overlay" onClick={onClose}>
      <div className="pet-overlay-content" onClick={(e) => e.stopPropagation()}>
        <div className="pet-overlay-header">
          <h2 className="pet-overlay-title">{`${clientName}'s Pet`}</h2>
          <button className="pet-overlay-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="pet-overlay-body">
          {pets.length > 0 ? (
            pets.map((pet, index) => (
              <div key={index} className="pet-overlay-card">
                <h3 className="pet-overlay-card-title">{`${pet.name} (${pet.type})`}</h3>
                <p className="pet-overlay-card-details">
                 {`${pet.gender}, ${pet.health_condition ? pet.health_condition : "None"}`}
                </p>
              </div>
            ))
          ) : (
            <p className="pet-overlay-no-pets">No pets found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetOverlay;
