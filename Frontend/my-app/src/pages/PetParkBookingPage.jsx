import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import ContactSection from '../components/ContactSection.jsx';
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import '../styles/PetParkBooking.css';
import SelectTime from '../components/SelectTime.jsx';
import SelectPet from '../components/SelectPet.jsx';
import Overlay from '../components/Overlay.jsx';
import api from '../api.js';

const PetParkAppointmentPage = () => {
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
        const response = await api.get('/api/pet/NameAndType', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPets(response.data.pets);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    const fetchBookingDetails = async () => {
      try {
        const response = await api.get(`/api/bookings/4/${booking_id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const booking = response.data.booking;
        setSelectedDate(new Date(booking.booking_date));
        setSelectedTime(booking.time_slot);

        if (pets.length > 0) {
          const pet = pets.find(p => p.pet_id === booking.pet_id);
          setSelectedPet(pet ? `${pet.name} - ${pet.type}` : '');
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets().then(() => {
      if (booking_id) fetchBookingDetails();
      else setLoading(false);
    });
  }, [booking_id]);

  const isTimeSlotValid = (date, timeSlot) => {
    const now = new Date();
    const selectedDate = new Date(date);
    
    // If selected date is in the future, time slot is valid
    if (selectedDate.getDate() !== now.getDate() || 
        selectedDate.getMonth() !== now.getMonth() || 
        selectedDate.getFullYear() !== now.getFullYear()) {
      return true;
    }

    // For same day bookings, check if the time slot hasn't passed
    const [startTime] = timeSlot.split(' - ');
    const [hours, minutes] = startTime.split(':').map(Number);
    
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hours, minutes, 0, 0);

    return slotTime > now;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedPetObj = pets.find(pet => `${pet.name} - ${pet.type}` === selectedPet);
    if (!selectedPetObj || !selectedDate || !selectedTime) {
      setOverlayMessage('Please complete all fields.');
      setShowOverlay(true);
      return;
    }

    // Check if the selected time slot is valid
    if (!isTimeSlotValid(selectedDate, selectedTime)) {
      setOverlayMessage('Cannot book this time slot as it has already passed.');
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
        ? `/api/update/4/${booking_id}`
        : '/api/4/book';

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
          ? 'Pet Park appointment updated!'
          : 'Pet Park appointment successful!'
      );
      setShowOverlay(true);

      if (!booking_id) {
        setSelectedDate(null);
        setSelectedTime('');
        setSelectedPet('');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
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
    <div className="PetPark-appointment-wrapper">
      <Navbar />
      <h1 className="PetPark-appointment-title">Pet Park Appointment</h1>
      <div className="PetPark-appointment-main">
        <div className="date-picker-wrapper">
          <h3 className="PetPark-section-heading">Select Date</h3>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            format="dd MMMM yyyy"
          />
        </div>

        <SelectTime selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
        <SelectPet pets={pets} selectedPet={selectedPet} setSelectedPet={setSelectedPet} />

        <button className="PetPark-submit-button" onClick={handleSubmit}>
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

export default PetParkAppointmentPage;