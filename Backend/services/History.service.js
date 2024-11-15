import CustomerFeedback from '../models/CustomerFeedbacks.js';
import User from '../models/User.model.js';
import dayjs from 'dayjs';

const HistoryService = {
    async getAppointmentsWithinDateRange(userId, startDate, endDate, role) {
        try {
            // Fetch user bookings
            const bookings = await User.getUserBookings(userId, startDate, endDate, role);

            // Format bookings and check for feedback sequentially
            const formattedBookings = [];
            for (const booking of bookings) {
                if (booking.date) {
                    try {
                        booking.date = dayjs(booking.date).format('YYYY-MM-DD');
                    } catch (error) {
                        console.warn(`Invalid date value encountered for booking:`, booking);
                        booking.date = null;
                    }
                }

                // Check if feedback exists for the booking
                const hasFeedback = await CustomerFeedback.checkHistoryFeedback(booking.booking_id,role);

                // Add formatted booking with feedback status
                formattedBookings.push({ ...booking, has_feedback: hasFeedback });
            }

            return formattedBookings;
        } catch (error) {
            console.error(`Error fetching booking history: ${error.message}`);
            return { error: 'Error fetching booking history' };
        }
    },
};

export default HistoryService;
