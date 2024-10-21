import React from 'react';
import '../styles/SelectTime.css'

const SelectTime = ({ selectedTime, setSelectedTime }) => {
  return (
    <div className="time-selection-wrapper">
      <h3 className="vaccine-section-heading">Select Time</h3>

      <div className="time-section">
        <h4 className="time-label">Morning</h4>
        <div className="time-options">
          {['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00'].map((time, idx) => (
            <button
              key={idx}
              className={`time-option-button ${selectedTime === time ? 'selected' : ''}`}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div className="time-section">
        <h4 className="time-label">Afternoon</h4>
        <div className="time-options">
          {['13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00'].map((time, idx) => (
            <button
              key={idx}
              className={`time-option-button ${selectedTime === time ? 'selected' : ''}`}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div className="time-section">
        <h4 className="time-label">Evening</h4>
        <div className="time-options">
          {['16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00'].map((time, idx) => (
            <button
              key={idx}
              className={`time-option-button ${selectedTime === time ? 'selected' : ''}`}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectTime;
