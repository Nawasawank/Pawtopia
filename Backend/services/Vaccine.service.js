import { OtherService, Employee } from '../database.js';

const VaccineService = {
    async addVaccineBooking(bookingData) {
        try {
            const employee = await Employee.getRandomEmployeeForService(3);
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
                1 
            );

            if (isBook) {
                return { error: 'You have already booked this slot' };
            }

            const newBooking = await OtherService.createBooking({
                pet_id: bookingData.pet_id,
                employee_id,
                service_id: 3,
                booking_date: bookingData.booking_date,
                time_slot: bookingData.time_slot,
            });

            return newBooking;
        } catch (error) {
            console.error('Error in addVaccineBooking service:', error.message);
            return { error: 'Failed to add vaccine booking' };
        }
    },

    async deleteVaccineBooking(bookingId) {
        try {
            const result = await OtherServicesBookingModel.deleteBooking(bookingId);
            return result;
        } catch (error) {
            console.error('Error in deleteVaccineBooking service:', error);
            return { error: 'Failed to delete vaccine booking' };
        }
    },

    async getVaccineBookingById(bookingId) {
        try {
            const booking = await OtherServicesBookingModel.findBookingById(bookingId);
            return booking;
        } catch (error) {
            console.error('Error in getVaccineBookingById service:', error);
            return { error: 'Failed to retrieve vaccine booking' };
        }
    }
};

export default VaccineService;
