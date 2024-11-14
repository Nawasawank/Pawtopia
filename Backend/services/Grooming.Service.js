import { OtherService, Employee } from '../database.js';

const GroomingService = {
    async addGroomingBooking(bookingData, role) {  // Add role as a parameter
        try {
            const employee = await Employee.getRandomEmployeeForService(1, role);  // Pass role to model function
            if (!employee) {
                return { error: 'No available employee for the service' };
            }
            const employee_id = employee.employee_id;

            console.log("Booking_Date --->" + bookingData.booking_date);

            console.log("Date--> " + Date.now());

            if (new Date(bookingData.booking_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                return { error: 'You cannot book a date in the past' };
            }

            const available = await OtherService.findAvailableBooking(
                employee_id,
                bookingData.booking_date,
                bookingData.time_slot,
                role  // Pass role to the model function
            );

            if (available) {
                return { error: 'Time slot not available' };
            }

            const isBook = await OtherService.findBooking(
                bookingData.pet_id,
                bookingData.booking_date,
                bookingData.time_slot,
                1, 
                role  // Pass role to the model function
            );

            if (isBook) {
                return { error: 'You have already booked this slot' };
            }

            const newBooking = await OtherService.createBooking({
                pet_id: bookingData.pet_id,
                employee_id,
                service_id: 1,
                booking_date: bookingData.booking_date,
                time_slot: bookingData.time_slot,
            }, role);  // Pass role to the model function

            return newBooking;
        } catch (error) {
            console.error('Error in addGroomingBooking service:', error.message);
            return { error: 'Failed to add Grooming booking' };
        }
    },

    async deleteGroomingBooking(booking_id, role) {  // Pass role to the function
        try {
            const result = await OtherService.deleteBooking(booking_id, role);  // Pass role to model function
            return result;
        } catch (error) {
            console.error('Error in deleteGroomingBooking service:', error);
            return { error: 'Failed to delete Grooming booking' };
        }
    },

    async getGroomingBookingById(booking_id, role) {  // Pass role to the function
        try {
            const booking = await OtherService.findBookingById(booking_id, role);  // Pass role to model function
            return booking;
        } catch (error) {
            console.error('Error in getGroomingBookingById service:', error);
            return { error: 'Failed to retrieve Grooming booking' };
        }
    },

    async updateGroomingBooking(booking_id, updateData, role) {  // Pass role to the function
        try {
            const existingBooking = await OtherService.findBookingById(booking_id, role);  // Pass role to model function
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
                role  // Pass role to the model function
            );

            if (available && available.booking_id !== booking_id) {
                return { error: 'Time slot not available' };
            }

            const isBook = await OtherService.findBooking(
                updateData.pet_id,
                updateData.booking_date,
                updateData.time_slot,
                existingBooking.service_id,
                role  // Pass role to the model function
            );
            if (isBook && isBook.booking_id !== booking_id) {
                return { error: 'You have already booked this slot' };
            }

            const updatedBooking = await OtherService.updateBooking(booking_id, {
                pet_id: updateData.pet_id,
                booking_date: updateData.booking_date,
                time_slot: updateData.time_slot,
            }, role);  // Pass role to the model function

            return updatedBooking;
        } catch (error) {
            console.error('Error in updateGroomingBooking service:', error);
            return { error: 'Failed to update Grooming booking' };
        }
    }
};

export default GroomingService;
