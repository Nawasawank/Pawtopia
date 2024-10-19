import { OtherService, Employee } from '../database.js';

const GroomingService = {
    async addGroomingBooking(bookingData) {
        try {
            const employee = await Employee.getRandomEmployeeForService(1);
            const employee_id = employee.employee_id;

            const existingBooking = await OtherService.findAvailableBooking(
                employee_id,
                bookingData.booking_date,
                bookingData.time_slot
            );

            if (existingBooking) {
                return { error: 'Employee is already booked for the selected date and time slot.' };
            }

            const newBooking = await OtherService.createBooking({
                pet_id: bookingData.pet_id,
                employee_id,
                service_id: 1,
                booking_date: bookingData.booking_date,
                time_slot: bookingData.time_slot,
            });

            return newBooking;
        } catch (error) {
            console.error('Error in addGroomingBooking service:', error.message);
            return { error: 'Failed to add Grooming booking' };
        }
    },

    async deleteGroomingBooking(bookingId) {
        try {
            const result = await OtherService.deleteBooking(bookingId);
            return result;
        } catch (error) {
            console.error('Error in deleteGroomingBooking service:', error);
            return { error: 'Failed to delete Grooming booking' };
        }
    },

    async getGroomingBookingById(bookingId) {
        try {
            const booking = await OtherService.findBookingById(bookingId);
            return booking;
        } catch (error) {
            console.error('Error in getGroomingBookingById service:', error);
            return { error: 'Failed to retrieve Grooming booking' };
        }
    }
};

export default GroomingService;
