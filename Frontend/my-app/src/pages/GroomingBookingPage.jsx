import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import ContactSection from '../components/ContactSection.jsx';
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import '../styles/GroomingBooking.css';
import SelectTime from '../components/SelectTime.jsx';
import SelectPet from '../components/SelectPet.jsx';
import Overlay from '../components/Overlay.jsx';
import api from '../api.js';

const GroomingAppointmentPage = () => {
  const { booking_id } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState('');
  const [previousBookingData, setPreviousBookingData] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await api.get('/api/pet/NameAndType', {
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
        const response = await api.get(`/api/bookings/1/${booking_id}`, { 
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
    
        setPreviousBookingData({
          pet_id: booking.pet_id,
          booking_date: booking.booking_date,
          time_slot: booking.time_slot,
        });
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
        ? `/api/update/1/${booking_id}`
        : '/api/1/book'; 
  
      const response = booking_id
        ? await api.put(endpoint, bookingData, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
        : await api.post(endpoint, bookingData, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
  
      setOverlayMessage(
        response.data.error
          ? response.data.error
          : booking_id
          ? 'Grooming appointment updated!'
          : 'Grooming appointment successful!'
      );
      setShowOverlay(true);
  
      if (!booking_id) {
        setSelectedDate(null);
        setSelectedTime('');
        setSelectedPet('');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      console.log(error.response?.data); 
      setOverlayMessage(error.response?.data?.message || 'Error submitting booking');
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
    <div className="Groom-appointment-wrapper">
      <Navbar />
      <h1 className="Groom-appointment-title">Grooming Appointment</h1>
      <div className="Groom-appointment-main">
        <div className="date-picker-wrapper">
          <h3 className="Groom-section-heading">Select Date</h3>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            format="dd MMMM yyyy"
          />
        </div>

        <SelectTime selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
        <SelectPet pets={pets} selectedPet={selectedPet} setSelectedPet={setSelectedPet} />

        <button className="Groom-submit-button" onClick={handleSubmit}>
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

export default GroomingAppointmentPage;
