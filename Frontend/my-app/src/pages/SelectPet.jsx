import React from 'react';
import '../components/SelectPet.css';

const SelectPet = ({ pets, selectedPet, setSelectedPet }) => {
  return (
    <div className="pet-selection-wrapper">
      <h3 className="section-heading">Select Your Pet</h3>
      <div className="pet-selection-options">
        {pets.map((pet, idx) => (
          <label key={idx} className="pet-selection-option">
            <input
              type="radio"
              name="pet"
              value={`${pet.name} - ${pet.type}`}
              checked={selectedPet === `${pet.name} - ${pet.type}`}
              onChange={() => setSelectedPet(`${pet.name} - ${pet.type}`)}
            />
            {`${pet.name} - ${pet.type}`}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SelectPet;
