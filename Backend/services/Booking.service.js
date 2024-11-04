import { OtherService,Employee } from '../database.js';

const bookingsService = {
    async getBookingsByDate(date) {
        try {
            const bookings = await  OtherService.getBookingsByDate(date);
            return bookings;
        } catch (error) {
            console.error("Error in bookingsService - getBookingsByDate:", error);
            throw new Error("Could not fetch bookings for the specified date.");
        }
    },
    async addBooking(bookingData, service_id) {
        try {
            // Find a random employee for the specified service
            const employee = await Employee.getRandomEmployeeForService(service_id);
            if (!employee) {
                return { error: 'No available employee for the service' };
            }
            const employee_id = employee.employee_id;

            // Check if the booking date is in the past
            if (new Date(bookingData.booking_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                return { error: 'You cannot book a date in the past' };
            }

            // Check if the time slot is available for the employee
            const available = await OtherService.findAvailableBooking(
                employee_id,
                bookingData.booking_date,
                bookingData.time_slot
            );

            if (available) {
                return { error: 'Time slot not available' };
            }

            // Check if the pet already has a booking in the same time slot and date
            const isBook = await OtherService.findBooking(
                bookingData.pet_id,
                bookingData.booking_date,
                bookingData.time_slot,
                service_id
            );

            if (isBook) {
                return { error: 'You have already booked this slot' };
            }

            // Create the booking
            const newBooking = await OtherService.createBooking({
                pet_id: bookingData.pet_id,
                employee_id,
                service_id,
                booking_date: bookingData.booking_date,
                time_slot: bookingData.time_slot,
            });

            return newBooking;
        } catch (error) {
            console.error('Error in addBooking service:', error.message);
            return { error: `Failed to add booking for service ${service_id}` };
        }
    },

    async deleteBooking(booking_id) {
        try {
            const result = await OtherService.deleteBooking(booking_id);
            return result;
        } catch (error) {
            console.error('Error in deleteBooking service:', error);
            return { error: 'Failed to delete booking' };
        }
    },

    async getBookingById(booking_id) {
        try {
            console.log(`Fetching booking with ID: ${booking_id}`); // Debug: Check booking_id only
    
            const booking = await OtherService.findBookingById(booking_id);
            
            // Confirm that booking is fetched without requiring date
            if (!booking) {
                console.warn(`Booking with ID ${booking_id} not found.`);
                return { error: 'Booking not found' };
            }
    
            return booking;
        } catch (error) {
            console.error('Error in getBookingById service:', error);
            return { error: 'Failed to retrieve booking' };
        }
    },    

    async updateBooking(booking_id, updateData) {
        try {
            const existingBooking = await OtherService.findBookingById(booking_id);
            if (!existingBooking) {
                return { error: 'Booking not found' };
            }
    
            const employee_id = existingBooking.employee_id;
    
            // Check if the booking date is in the past
            if (new Date(updateData.booking_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                return { error: 'You cannot book a date in the past' };
            }
    
            // Check if the time slot is available for the employee
            const available = await OtherService.findAvailableBooking(
                employee_id,
                updateData.booking_date,
                updateData.time_slot
            );
    
            if (available && available.booking_id !== booking_id) {
                return { error: 'Time slot not available' };
            }
    
            // Check if the pet already has a booking in the same time slot and date
            const isBook = await OtherService.findBooking(
                updateData.pet_id,
                updateData.booking_date,
                updateData.time_slot,
                existingBooking.service_id
            );
            if (isBook && isBook.booking_id !== booking_id) {
                return { error: 'You have already booked this slot' };
            }
    
            // Update the booking
            const updatedBooking = await OtherService.updateBooking(booking_id, {
                pet_id: updateData.pet_id,
                booking_date: updateData.booking_date,
                time_slot: updateData.time_slot,
            });
    
            return updatedBooking;
        } catch (error) {
            console.error('Error in updateBooking service:', error);
            return { error: 'Failed to update booking' };
        }
    }
};

export default bookingsService;


