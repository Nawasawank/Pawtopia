import { OtherService, Employee } from '../database.js';

const SwimmingService = {
    async addSwimmingBooking(bookingData, role) {
        try {
            const employee = await Employee.getRandomEmployeeForService(2, role); // Pass role to the function
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
                role // Pass role to the function
            );

            if (available) {
                return { error: 'Time slot not available' };
            }

            const isBook = await OtherService.findBooking(
                bookingData.pet_id,
                bookingData.booking_date,
                bookingData.time_slot,
                2,
                role // Pass role to the function
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
            }, role); // Pass role to the function

            return newBooking;
        } catch (error) {
            console.error('Error in addSwimmingBooking service:', error.message);
            return { error: 'Failed to add swimming booking' };
        }
    },

    async deleteSwimmingBooking(booking_id, role) {
        try {
            const result = await OtherService.deleteBooking(booking_id, role); // Pass role to the function
            return result;
        } catch (error) {
            console.error('Error in deleteSwimmingBooking service:', error);
            return { error: 'Failed to delete swimming booking' };
        }
    },

    async getSwimmingBookingById(booking_id, role) {
        try {
            const booking = await OtherService.findBookingById(booking_id, role); // Pass role to the function
            return booking;
        } catch (error) {
            console.error('Error in getSwimmingBookingById service:', error);
            return { error: 'Failed to retrieve swimming booking' };
        }
    },

    async updateSwimmingBooking(booking_id, updateData, role) {
        try {
            const existingBooking = await OtherService.findBookingById(booking_id, role); // Pass role to the function
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
                role // Pass role to the function
            );

            if (available && available.booking_id !== booking_id) {
                return { error: 'Time slot not available' };
            }

            const isBook = await OtherService.findBooking(
                updateData.pet_id,
                updateData.booking_date,
                updateData.time_slot,
                existingBooking.service_id,
                role // Pass role to the function
            );
            if (isBook && isBook.booking_id !== booking_id) {
                return { error: 'You have already booked this slot' };
            }

            const updatedBooking = await OtherService.updateBooking(booking_id, {
                pet_id: updateData.pet_id,
                booking_date: updateData.booking_date,
                time_slot: updateData.time_slot,
            }, role); // Pass role to the function

            return updatedBooking;
        } catch (error) {
            console.error('Error in updateSwimmingBooking service:', error);
            return { error: 'Failed to update Swimming booking' };
        }
    }
};

export default SwimmingService;
