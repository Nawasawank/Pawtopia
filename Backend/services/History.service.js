import { User } from '../database.js';
import dayjs from 'dayjs';

const HistoryService = {
    async getAppointmentsWithinDateRange(userId, startDate, endDate) {
        try {
            const bookings = await User.getUserBookings(userId, startDate, endDate);
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

