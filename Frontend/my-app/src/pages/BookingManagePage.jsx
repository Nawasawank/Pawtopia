import React, { useState, useEffect } from 'react';
import Navbar from '../components/admin_navbar.jsx';
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import api from '../api.js';
import '../styles/bookingmanage.css';

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  useEffect(() => {
    if (selectedService && selectedDate) {
      fetchBookings(selectedService, selectedDate);
    }
  }, [selectedService]); 

  const fetchBookings = async (serviceId, date) => {
    try {
      const localDate = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '';
      console.log("Adjusted Local Date:", localDate);
      console.log("Selected Service:", serviceId);
  
      const response = await api.get(`/api/bookings/by-date?date=${localDate}&service_id=${serviceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      console.log("API Response:", response);
      setBookings(response.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
  };
  

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDateOk = (date) => {
    setSelectedDate(date);
    if (selectedService) {
      fetchBookings(selectedService, date);
    }
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  return (
    <div className="booking-management-wrapper">
      <Navbar />
      <h1 className="booking-title">Booking Management</h1>
      <div className="b-filter-section">
        <div className="b-filter-item">
          <label>Select Service:</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="">Select a Service</option>
            <option value="1">Grooming Service</option>
            <option value="2">Swimming Service</option>
            <option value="3">Vaccination Service</option>
            <option value="4">Pet Park</option>
          </select>
        </div>
        <div className="b-filter-item">
          <label>Select Date:</label>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            onOk={handleDateOk} 
            format="dd/MM/yyyy"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <table className="booking-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer Name</th>
            <th>Pet</th>
            <th>Time</th>
            <th>Employee</th>
          </tr>
        </thead>
        <tbody>
          {currentBookings.length > 0 ? (
            currentBookings.map((booking) => (
              <tr key={booking.booking_id}>
                <td>{booking.booking_id}</td>
                <td>{booking.customer_name}</td>
                <td>{booking.pet_name}</td>
                <td>{booking.time_slot}</td>
                <td>{booking.employee_name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No bookings found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <a
            key={i + 1}
            href="#"
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i + 1);
            }}
          >
            {i + 1}
          </a>
        ))}
      </div>
    </div>
  );
};

export default BookingManagementPage;
