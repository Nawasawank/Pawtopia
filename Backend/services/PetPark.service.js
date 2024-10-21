import { OtherService, Employee } from '../database.js';

const PetParkService = {
    async addPetParkBooking(bookingData) {
        try {
            const employee = await Employee.getRandomEmployeeForService(4);
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
                service_id: 4,
                booking_date: bookingData.booking_date,
                time_slot: bookingData.time_slot,
            });

            return newBooking;
        } catch (error) {
            console.error('Error in addPetParkBooking service:', error.message);
            return { error: 'Failed to add Pet Park booking' };
        }
    },

    async deletePetParkBooking(bookingId) {
        try {
            const result = await OtherService.deleteBooking(bookingId);
            return result;
        } catch (error) {
            console.error('Error in deletePetParkBooking service:', error);
            return { error: 'Failed to delete Pet Park booking' };
        }
    },

    async getPetParkBookingById(bookingId) {
        try {
            const booking = await OtherService.findBookingById(bookingId);
            return booking;
        } catch (error) {
            console.error('Error in getPetParkBookingById service:', error);
            return { error: 'Failed to retrieve PetPark booking' };
        }
    }
};

export default PetParkService;
