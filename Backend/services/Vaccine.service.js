import { OtherService, Employee } from '../database.js';

const VaccineService = {
    async addVaccineBooking(bookingData) {
        try {
            const employee = await Employee.getRandomEmployeeForService(3);
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
