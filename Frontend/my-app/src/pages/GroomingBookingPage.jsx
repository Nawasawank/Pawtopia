import React, { useState, useEffect } from 'react';
import Navbar from '../utils/navbar.jsx';
import ContactSection from '../utils/ContactSection.jsx';
import { DatePicker } from 'rsuite'; 
import 'rsuite/dist/rsuite.min.css'; 
import '../components/GroomingBooking.css';
import SelectTime from './SelectTime.jsx';
import SelectPet from './SelectPet.jsx';   

const GroomingAppointmentPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pet/NameAndType', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pets');
        }

        const data = await response.json();
        setPets(data.pets);
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
      alert('Please complete all fields.');
      return;
    }

    const bookingData = {
      pet_id: selectedPetObj.pet_id,
      appointment_date: selectedDate.toISOString().split('T')[0],
      appointment_time: selectedTime,
    };

    try {
      const response = await fetch('', { // Waiting for API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      const result = await response.json();
      console.log('Pet Park appointment successful:', result);
      alert('Pet Park appointment successful!');
      setSelectedDate(null);
      setSelectedTime('');
      setSelectedPet('');
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Error submitting booking');
    }
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
          Submit
        </button>
      </div>

      <ContactSection />
    </div>
  );
};

export default GroomingAppointmentPage;