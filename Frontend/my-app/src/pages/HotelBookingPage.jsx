import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import Navbar from '../components/navbar.jsx';
import ContactSection from '../components/ContactSection.jsx';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import '../styles/HotelBooking.css';
import axios from 'axios';
import Overlay from '../components/Overlay.jsx';

const HotelBookingPage = () => {
  const { booking_id } = useParams(); // Capture booking_id for edit mode
  const [dateRange, setDateRange] = useLocalStorage('dateRange', []);
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
        return response.data.pets;
      } catch (error) {
        console.error('Error fetching pets:', error);
        return [];
      }
    };

    const fetchBookingDetails = async (loadedPets) => {
      if (!booking_id) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/booking/Hotel/${booking_id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const booking = response.data.booking;
        setDateRange([new Date(booking.check_in_date), new Date(booking.check_out_date)]);
        setSelectedRoom(booking.room_size);
        const pet = loadedPets.find(p => p.pet_id === booking.pet_id);
        setSelectedPet(pet ? `${pet.name} - ${pet.type}` : '');
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    const initializeForm = async () => {
      const loadedPets = await fetchPets();
      
      if (booking_id) {
        // Fetch booking details if we are in edit mode
        fetchBookingDetails(loadedPets);
      } else {
        // Clear form fields if we're in create mode
        setDateRange([]);
        setSelectedRoom('');
        setSelectedPet('');
      }

      setLoading(false);
    };

    initializeForm();
  }, [booking_id, setDateRange, setSelectedRoom, setSelectedPet]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedPetObj = pets.find(
      pet => `${pet.name} - ${pet.type}` === selectedPet
    );

    if (!selectedPetObj || dateRange.length < 2 || !selectedRoom) {
      setOverlayMessage('Please complete all fields.');
      setShowOverlay(true);
      return;
    }

    const bookingData = {
      pet_id: selectedPetObj.pet_id,
      check_in_date: new Date(dateRange[0].getTime() - dateRange[0].getTimezoneOffset() * 60000).toISOString().split('T')[0],
      check_out_date: new Date(dateRange[1].getTime() - dateRange[1].getTimezoneOffset() * 60000).toISOString().split('T')[0],
      room_size: selectedRoom,
    };

    try {
      const endpoint = booking_id
        ? `http://localhost:5000/api/update-booking/hotel/${booking_id}`
        : 'http://localhost:5000/api/booking/Hotel';

      const response = booking_id
        ? await axios.patch(endpoint, bookingData, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
        : await axios.post(endpoint, bookingData, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

      setOverlayMessage(
        response.data.error ? response.data.error : booking_id ? 'Booking updated successfully!' : 'Booking successful!'
      );
      setShowOverlay(true);

      if (!booking_id) {
        setDateRange([]);
        setSelectedRoom('');
        setSelectedPet('');
      }
      
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
          {booking_id ? 'Update Booking' : 'Submit'}
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
