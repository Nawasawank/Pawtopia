import { OtherService, Employee } from '../database.js';

const PetParkService = {
    async addPetParkBooking(bookingData, role) {
        try {
            const employee = await Employee.getRandomEmployeeForService(4, role);  // Pass role to database method
            if (!employee) {
                return { error: 'No available employee for the service' };
            }
            const employee_id = employee.employee_id;

            if (new Date(bookingData.booking_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                return { error: 'You cannot book a date in the past' };
            }

            const available = await OtherService.findAvailableBooking(
                employee_id,
                bookingData.booking_date,
                bookingData.time_slot,
                role  // Pass role to database method
            );

            if (available) {
                return { error: 'Time slot not available' };
            }

            const isBook = await OtherService.findBooking(
                bookingData.pet_id,
                bookingData.booking_date,
                bookingData.time_slot,
                1,
                role  // Pass role to database method
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
            }, role);  // Pass role to database method

            return newBooking;
        } catch (error) {
            console.error('Error in addPetParkBooking service:', error.message);
            return { error: 'Failed to add Pet Park booking' };
        }
    },

    async deletePetParkBooking(booking_id, role) {
        try {
            const result = await OtherService.deleteBooking(booking_id, role);  // Pass role to database method
            return result;
        } catch (error) {
            console.error('Error in deletePetParkBooking service:', error);
            return { error: 'Failed to delete Pet Park booking' };
        }
    },

    async getPetParkBookingById(booking_id, role) {
        try {
            const booking = await OtherService.findBookingById(booking_id, role);  // Pass role to database method
            return booking;
        } catch (error) {
            console.error('Error in getPetParkBookingById service:', error);
            return { error: 'Failed to retrieve PetPark booking' };
        }
    },

    async updatePetParkBooking(booking_id, updateData, role) {
        try {
            const existingBooking = await OtherService.findBookingById(booking_id, role);  // Pass role to database method
            if (!existingBooking) {
                return { error: 'Booking not found' };
            }

            const employee_id = existingBooking.employee_id;

            if (new Date(updateData.booking_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                return { error: 'You cannot book a date in the past' };
            }

            const available = await OtherService.findAvailableBooking(
                employee_id,
                updateData.booking_date,
                updateData.time_slot,
                role  // Pass role to database method
            );

            if (available && available.booking_id !== booking_id) {
                return { error: 'Time slot not available' };
            }

            const isBook = await OtherService.findBooking(
                updateData.pet_id,
                updateData.booking_date,
                updateData.time_slot,
                existingBooking.service_id,
                role  // Pass role to database method
            );
            if (isBook && isBook.booking_id !== booking_id) {
                return { error: 'You have already booked this slot' };
            }

            const updatedBooking = await OtherService.updateBooking(booking_id, {
                pet_id: updateData.pet_id,
                booking_date: updateData.booking_date,
                time_slot: updateData.time_slot,
            }, role);  // Pass role to database method

            return updatedBooking;
        } catch (error) {
            console.error('Error in updatePetParkBooking service:', error);
            return { error: 'Failed to update Pet Park booking' };
        }
    }
};

export default PetParkService;
