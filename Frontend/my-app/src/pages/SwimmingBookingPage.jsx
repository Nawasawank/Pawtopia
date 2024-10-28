import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import ContactSection from '../components/ContactSection.jsx';
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import '../styles/SwimBooking.css';
import SelectTime from '../components/SelectTime.jsx';
import SelectPet from '../components/SelectPet.jsx';
import axios from 'axios';
import Overlay from '../components/Overlay.jsx';

const SwimmingAppointmentPage = () => {
  const { booking_id } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
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
        const response = await axios.get(`http://localhost:5000/api/booking/Swimming/${booking_id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const booking = response.data.booking;
        setSelectedDate(new Date(booking.booking_date));
        setSelectedTime(booking.time_slot);

        const pet = loadedPets.find(p => p.pet_id === booking.pet_id);
        setSelectedPet(pet ? `${pet.name} - ${pet.type}` : '');
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    fetchPets().then((loadedPets) => {
      if (booking_id) {
        fetchBookingDetails(loadedPets).then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, [booking_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedPetObj = pets.find(pet => `${pet.name} - ${pet.type}` === selectedPet);
    if (!selectedPetObj || !selectedDate || !selectedTime) {
      setOverlayMessage('Please complete all fields.');
      setShowOverlay(true);
      return;
    }

    const bookingData = {
      pet_id: selectedPetObj.pet_id,
      booking_date: new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0],
      time_slot: selectedTime,
    };

    try {
      const endpoint = booking_id
        ? `http://localhost:5000/api/update-booking/swimming/${booking_id}`
        : 'http://localhost:5000/api/booking/Swimming';

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

      setOverlayMessage(response.data.error ? response.data.error : booking_id ? 'Swimming appointment updated!' : 'Swimming appointment successful!');
      setShowOverlay(true);

      if (!booking_id) {
        setSelectedDate(null);
        setSelectedTime('');
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
    <div className="swim-appointment-wrapper">
      <Navbar />
      <h1 className="swim-appointment-title">Swimming Appointment</h1>
      <div className="swim-appointment-main">
        <div className="swim-picker-wrapper">
          <h3 className="swim-section-heading">Select Date</h3>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            format="dd MMMM yyyy"
          />
        </div>

        <SelectTime selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
        <SelectPet pets={pets} selectedPet={selectedPet} setSelectedPet={setSelectedPet} />

        <button className="swim-submit-button" onClick={handleSubmit}>
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

export default SwimmingAppointmentPage;
