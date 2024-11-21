import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import Navbar from '../components/navbar.jsx';
import ContactSection from '../components/ContactSection.jsx';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import Feedback_Overlay from '../components/Feedback_Overlay.jsx';
import ConfirmDeleteOverlay from '../components/ConfirmDeleteOverlay.jsx';
import Overlay from '../components/Overlay.jsx'; // Import your Overlay component
import '../styles/History.css';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

const HistoryPage = () => {
    const [dateRange, setDateRange] = useLocalStorage('dateRange', null);
    const [appointments, setAppointments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const appointmentsPerPage = 10;
    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayMessage, setOverlayMessage] = useState('');
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false); // For delete confirmation
    const [showErrorOverlay, setShowErrorOverlay] = useState(false); // For error message
    const [errorOverlayMessage, setErrorOverlayMessage] = useState('');

    const fetchHistory = async (startDate, endDate) => {
        try {
            const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
            const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');
            const response = await api.get(`/api/history`, {
                params: {
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setAppointments(response.data);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    useEffect(() => {
        setDateRange(null);
    }, []);

    useEffect(() => {
        if (dateRange && dateRange[0] && dateRange[1]) {
            fetchHistory(dateRange[0], dateRange[1]);
        }
    }, [dateRange]);

    const handleOk = (selectedRange) => {
        setDateRange(selectedRange);
    };

    const handleAddFeedback = (appointment) => {
        setOverlayMessage('Add Feedback or Rating here!');
        setSelectedBookingId(appointment.booking_id);
        setShowOverlay(true);
    };

    const handleDeleteBooking = (appointment) => {
        setSelectedBookingId(appointment.booking_id);
        setShowDeleteOverlay(true);
    };

    const confirmDeleteBooking = async () => {
        try {
            await api.delete(`/api/delete/${selectedBookingId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setAppointments((prevAppointments) =>
                prevAppointments.filter((appt) => appt.booking_id !== selectedBookingId)
            );
            setShowDeleteOverlay(false);
        } catch (error) {
            console.error('Error deleting booking:', error);
            alert('Failed to delete booking. Please try again.');
        }
    };

    const handleSubmitFeedback = async (feedback) => {
        if (!feedback.rating || feedback.rating < 1 || feedback.rating > 5) {
            setErrorOverlayMessage('Please select a rating before submitting your feedback.');
            setShowErrorOverlay(true);
            return;
        }

        try {
            const feedbackData = {
                booking_id: selectedBookingId,
                comment: feedback.comment,
                rating: feedback.rating,
                feedback_type: 'General',
            };

            await api.post(`/api/feedback`, feedbackData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Update the state to reflect feedback submission
            setAppointments((prevAppointments) =>
                prevAppointments.map((appointment) =>
                    appointment.booking_id === selectedBookingId
                        ? { ...appointment, has_feedback: true }
                        : appointment
                )
            );

            setErrorOverlayMessage('Feedback submitted successfully!');
            setShowErrorOverlay(true);
            setShowOverlay(false);
        } catch (error) {
            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data.error === 'You already add feedback'
            ) {
                setErrorOverlayMessage(error.response.data.error);
                setShowErrorOverlay(true);
            } else {
                console.error('Error submitting feedback:', error);
                setErrorOverlayMessage('An error occurred while submitting feedback. Please try again.');
                setShowErrorOverlay(true);
            }
        }
    };

    const handleCloseOverlay = () => {
        setShowOverlay(false);
    };

    const handleCloseErrorOverlay = () => {
        setShowErrorOverlay(false);
        setErrorOverlayMessage('');
    };

    const isPastDate = (date) => {
        return dayjs(date).isBefore(dayjs(), 'day');
    };

    const navigate = useNavigate();

    const handleEditBooking = (appointment) => {
        const { booking_id, service_name } = appointment;
        if (service_name === 'Grooming') {
            navigate(`/grooming-booking/${booking_id}`);
        } else if (service_name === 'Vaccination') {
            navigate(`/vaccine-booking/${booking_id}`);
        } else if (service_name === 'Swimming') {
            navigate(`/swimming-booking/${booking_id}`);
        } else if (service_name === 'Pet Park') {
            navigate(`/petpark-booking/${booking_id}`);
        }
    };

    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
    const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="main-wrapper">
            <Navbar />
            <div className="content-wrapper">
                <div className="history-wrapper">
                    <h1 className="history-title">History</h1>

                    <div className="history-date-picker">
                        <h3>Select Date Range</h3>
                        <DateRangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            onOk={handleOk}
                            format="dd MMMM yyyy"
                        />
                    </div>

                    {dateRange && dateRange[0] && dateRange[1] && (
                        <div className="history-appointments">
                            {currentAppointments.map((appointment) => (
                                <div key={appointment.booking_id} className="appointment-card">
                                    <div className="appointment-info">
                                        <h2>{appointment.pet_name}</h2>
                                        <p>{appointment.employee_name}</p>
                                        <p>{appointment.service_name}</p>
                                    </div>
                                    <div className="appointment-status">
                                        <p>{dayjs(appointment.date).format('D MMM YYYY')}</p>
                                        {isPastDate(appointment.date) ? (
                                            appointment.has_feedback ? (
                                                <p className="status-feedback">Feedback Submitted</p>
                                            ) : (
                                                <button
                                                    className="feedback-button"
                                                    onClick={() => handleAddFeedback(appointment)}
                                                >
                                                    Add Feedback
                                                </button>
                                            )
                                        ) : (
                                            <>
                                                <p className="status-waiting">Waiting</p>
                                                <button
                                                    className="edit-button"
                                                    onClick={() => handleEditBooking(appointment)}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="delete-button"
                                                    onClick={() => handleDeleteBooking(appointment)}
                                                >
                                                    🗑️
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {dateRange && dateRange[0] && dateRange[1] && appointments.length > 0 && (
                        <div className="pagination-controls">
                            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                                &lt;
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                &gt;
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ContactSection />

            {showOverlay && (
                <Feedback_Overlay
                    message={overlayMessage}
                    show={showOverlay}
                    onClose={handleCloseOverlay}
                    onSubmitFeedback={handleSubmitFeedback}
                />
            )}

            {showDeleteOverlay && (
                <ConfirmDeleteOverlay
                    message="Are you sure you want to delete this booking?"
                    onConfirm={confirmDeleteBooking} // Confirm deletion
                    onCancel={() => setShowDeleteOverlay(false)} // Cancel and close overlay
                />
            )}

            {showErrorOverlay && (
                <Overlay
                    message={errorOverlayMessage}
                    onClose={handleCloseErrorOverlay}
                    show={showErrorOverlay}
                />
            )}
        </div>
    );
};

export default HistoryPage;
