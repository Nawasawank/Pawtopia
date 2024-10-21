import { OtherService, Employee } from '../database.js';

const SwimmingService = {
    async addSwimmingBooking(bookingData) {
        try {
            const employee = await Employee.getRandomEmployeeForService(2);
            if (!employee) {
                return { error: 'No available employee for the service' };
            }
            const employee_id = employee.employee_id;

            if (new Date(bookingData.booking_date) < Date.now()) {
                return { error: 'You cannot book a date in the past' };
            }

            const available = await OtherService.findAvailableBooking(
                employee_id,
                bookingData.booking_date,
                bookingData.time_slot
            );

            if (available) {
                return { error: 'Time slot not available' };
            }

            const isBook = await OtherService.findBooking(
                bookingData.pet_id,
                bookingData.booking_date,
                bookingData.time_slot,
                2
            );

            if (isBook) {
                return { error: 'You have already booked this slot' };
            }

            const newBooking = await OtherService.createBooking({
                pet_id: bookingData.pet_id,
                employee_id,
                service_id: 2,
                booking_date: bookingData.booking_date,
                time_slot: bookingData.time_slot,
            });

            return newBooking;
        } catch (error) {
            console.error('Error in addVaccineBooking service:', error.message);
            return { error: 'Failed to add swimming booking' };
        }
    },

    async deleteSwimmingBooking(bookingId) {
        try {
            const result = await OtherService.deleteBooking(bookingId);
            return result;
        } catch (error) {
            console.error('Error in deleteSwimmingBooking service:', error);
            return { error: 'Failed to delete swimming booking' };
        }
    },

    async getSwimmingBookingById(bookingId) {
        try {
            const booking = await OtherService.findBookingById(bookingId);
            return booking;
        } catch (error) {
            console.error('Error in getSwimmingBookingById service:', error);
            return { error: 'Failed to retrieve swimming booking' };
        }
    }
};

export default SwimmingService;
