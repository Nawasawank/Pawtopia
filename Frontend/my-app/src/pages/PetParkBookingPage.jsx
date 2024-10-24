import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar.jsx';
import ContactSection from '../components/ContactSection.jsx';
import { DatePicker } from 'rsuite'; 
import 'rsuite/dist/rsuite.min.css'; 
import '../styles/PetParkBooking.css';
import SelectTime from '../components/SelectTime.jsx';
import SelectPet from '../components/SelectPet.jsx';   
import axios from 'axios'; 
import Overlay from '../components/Overlay.jsx';

const PetParkAppointmentPage = () => {
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
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching pets:', error);
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const selectedPetObj = pets.find(
      pet => `${pet.name} - ${pet.type}` === selectedPet
    );
  
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
      const response = await axios.post('http://localhost:5000/api/booking/PetPark', bookingData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.data.error) {
        setOverlayMessage(response.data.error);
      } else {
        setOverlayMessage('Pet Park appointment successful!');
        setSelectedDate(null);
        setSelectedTime('');
        setSelectedPet('');
      }
      
      setShowOverlay(true);
      
    } catch (error) {
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

export default PetParkAppointmentPage;
