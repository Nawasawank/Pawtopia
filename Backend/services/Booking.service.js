import ServicesBooking from '../models/OtherService.model.js';
import Employee from '../models/Employee.model.js';

const bookingsService = {
    async getBookingsByDate(date, service_id, role) {
        try {
            const bookings = await ServicesBooking.getBookingsByDate(date, service_id, role);  // Pass role to the model
            return bookings;
        } catch (error) {
            console.error("Error in bookingsService - getBookingsByDate:", error);
            throw new Error("Could not fetch bookings for the specified date.");
        }
    },

    async addBooking(bookingData, service_id, role) {
        try {
            // Ensure that the role is passed properly to the model function
            const employee = await Employee.getRandomEmployeeForService(service_id, role); 
            console.log("employee ---->", employee);
            
            if (!employee) {
                return { error: 'No available employee for the service' };
            }
            
            const employee_id = employee.employee_id;
    
            const bookingDate = new Date(bookingData.booking_date);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
    
            if (bookingDate < currentDate) {
                return { error: 'You cannot book a date in the past' };
            }
    
            const available = await ServicesBooking.findAvailableBooking(
                employee_id,
                bookingData.booking_date,
                bookingData.time_slot,
                role  // Pass role here
            );
    
            if (available) {
                return { error: 'Time slot not available' };
            }
    
            const isBook = await ServicesBooking.findBooking(
                bookingData.pet_id,
                bookingData.booking_date,
                bookingData.time_slot,
                service_id,
                role  // Pass role here
            );
    
            if (isBook) {
                return { error: 'You have already booked this slot' };
            }
    
            const newBooking = await ServicesBooking.createBooking({
                pet_id: bookingData.pet_id,
                employee_id,
                service_id,
                booking_date: bookingData.booking_date,
                time_slot: bookingData.time_slot,
            }, role);  // Pass role to the model
    
            return newBooking;
        } catch (error) {
            console.error('Error in addBooking service:', error.message);
            return { error: `Failed to add booking for service ${service_id}` };
        }
    },    

    async deleteBooking(booking_id, role) {
        try {
            const result = await ServicesBooking.deleteBooking(booking_id, role);  // Pass role to the model
            return result;
        } catch (error) {
            console.error('Error in deleteBooking service:', error);
            return { error: 'Failed to delete booking' };
        }
    },

    async getBookingById(booking_id, role) {
        try {
            const booking = await ServicesBooking.findBookingById(booking_id, role);  // Pass role to the model

            if (!booking) {
                return { error: 'Booking not found' };
            }

            return booking;
        } catch (error) {
            console.error('Error in getBookingById service:', error);
            return { error: 'Failed to retrieve booking' };
        }
    },

    async updateBooking(booking_id, updateData, role) {
        try {
            const existingBooking = await ServicesBooking.findBookingById(booking_id, role);  // Pass role to the model
            if (!existingBooking) {
                return { error: 'Booking not found' };
            }

            const employee_id = existingBooking.employee_id;

            const available = await ServicesBooking.findAvailableBooking(
                employee_id,
                updateData.booking_date,
                updateData.time_slot,
                role  // Pass role here
            );

            if (available && available.booking_id !== booking_id) {
                return { error: 'Time slot not available' };
            }

            const isBook = await ServicesBooking.findBooking(
                updateData.pet_id,
                updateData.booking_date,
                updateData.time_slot,
                existingBooking.service_id,
                role
            );
            if (isBook && isBook.booking_id !== booking_id) {
                return { error: 'You have already booked this slot' };
            }

            const updatedBooking = await ServicesBooking.updateBooking(booking_id, {
                pet_id: updateData.pet_id,
                booking_date: updateData.booking_date,
                time_slot: updateData.time_slot,
            }, role);  

            return updatedBooking;
        } catch (error) {
            console.error('Error in updateBooking service:', error);
            return { error: 'Failed to update booking' };
        }
    }
};

export default bookingsService;
