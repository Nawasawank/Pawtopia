import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import Navbar from '../components/navbar.jsx';
import ContactSection from '../components/ContactSection.jsx';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css'; 
import '../styles/HotelBooking.css';
import axios from 'axios';
import Overlay from '../components/Overlay.jsx'; 

const HotelBookingPage = () => {
  const [dateRange, setDateRange] = useLocalStorage('dateRange', null);
  const [selectedRoom, setSelectedRoom] = useLocalStorage('selectedRoom', '');
  const [selectedPet, setSelectedPet] = useLocalStorage('selectedPet', '');
  const [pets, setPets] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [showOverlay, setShowOverlay] = useState(false); 
  const [overlayMessage, setOverlayMessage] = useState(''); 

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pet/NameAndType', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        });
  
        setPets(response.data.pets);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching pets:', error);
        setLoading(false);
      }
    };
  
    fetchPets();
  
    return () => {
      setDateRange(null); 
      setSelectedRoom(''); 
      setSelectedPet('');  
      localStorage.removeItem('dateRange');   
      localStorage.removeItem('selectedRoom'); 
      localStorage.removeItem('selectedPet'); 
    };
  }, [setDateRange, setSelectedRoom, setSelectedPet]); 
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedPetObj = pets.find(
      pet => `${pet.name} - ${pet.type}` === selectedPet
    );

    if (!selectedPetObj || !dateRange || !selectedRoom) {
      alert('Please complete all fields.');
      return;
    }

    const bookingData = {
      pet_id: selectedPetObj.pet_id, 
      check_in_date: new Date(dateRange[0].getTime() - dateRange[0].getTimezoneOffset() * 60000).toISOString().split('T')[0],
      check_out_date: new Date(dateRange[1].getTime() - dateRange[1].getTimezoneOffset() * 60000).toISOString().split('T')[0],
      room_size: selectedRoom,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/booking/Hotel', bookingData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      });

      if (response.data.error) {
        setOverlayMessage(response.data.error); 
      } else {
        setOverlayMessage('Booking successful!');
        setDateRange(null);
        setSelectedRoom('');
        setSelectedPet('');
      }
      
      setShowOverlay(true); 

      setTimeout(() => {
        setShowOverlay(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting booking:', error);
      setOverlayMessage('Error submitting booking');
      setShowOverlay(true);
    }
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false); 
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="hotel-booking-wrapper">
      <Navbar />

      <h1 className="hotel-booking-title">Hotel Booking</h1>
      <div className="hotel-booking-main">

        <div className="date-picker-wrapper">
          <h3 className="hotel-section-heading">Select Date Duration</h3>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            format="dd MMMM yyyy"
            character=" - "
            showOneCalendar={false}
          />
        </div>

        <div className="room-size-wrapper">
          <h3 className="hotel-section-heading">Select Room Size</h3>
          <div className="room-size-options">
            {['Size S (2-3 animals)', 'Size M (4-6 animals)', 'Size L (7-9 animals)', 'Size XL (10+ animals)'].map((size, idx) => (
              <button
                key={idx}
                className={`room-size-option-button ${selectedRoom === size ? 'selected' : ''}`}
                onClick={() => setSelectedRoom(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="pet-selection-wrapper">
          <h3 className="hotel-section-heading">Select Your Pet</h3>
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

        <button className="hotel-submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      <ContactSection />

      {showOverlay && (
        <Overlay message={overlayMessage} show={showOverlay} onClose={handleCloseOverlay} />
      )}
    </div>
  );
};

export default HotelBookingPage;
