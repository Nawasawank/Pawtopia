import User from '../models/User.model.js';
import dayjs from 'dayjs';

const HistoryService = {
    async getAppointmentsWithinDateRange(userId, startDate, endDate, role) {  // Accept role as parameter
        try {
            // Pass role to the model function
            const bookings = await User.getUserBookings(userId, startDate, endDate, role); 
            const formattedBookings = bookings.map(booking => {
                if (booking.date) {
                    try {
                        booking.date = dayjs(booking.date).format('YYYY-MM-DD');
                    } catch (error) {
                        console.warn(`Invalid date value encountered for booking:`, booking);
                        booking.date = null; 
                    }
                }
                return booking;
            });

            return formattedBookings;
        } catch (error) {
            console.error(`Error fetching booking history: ${error.message}`);
            return { error: 'Error fetching booking history' };
        }
    },
};

export default HistoryService;
