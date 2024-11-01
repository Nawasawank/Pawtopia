import { OtherService, Employee } from '../database.js';

const GroomingService = {
    async addGroomingBooking(bookingData) {
        try {
            const employee = await Employee.getRandomEmployeeForService(1);
            if (!employee) {
                return { error: 'No available employee for the service' };
            }
            const employee_id = employee.employee_id;


            console.log("Booking_Date --->"+bookingData.booking_date);
        
            console.log("Date--> "+Date.now());

            if (new Date(bookingData.booking_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                return { error: 'You cannot book a date in the past' };
            }
            
            console.log(Date.now())
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

    async deleteGroomingBooking(booking_id) {
        try {
            const result = await OtherService.deleteBooking(booking_id);
            return result;
        } catch (error) {
            console.error('Error in deleteGroomingBooking service:', error);
            return { error: 'Failed to delete Grooming booking' };
        }
    },

    async getGroomingBookingById(booking_id) {
        try {
            const booking = await OtherService.findBookingById(booking_id);
            return booking;
        } catch (error) {
            console.error('Error in getGroomingBookingById service:', error);
            return { error: 'Failed to retrieve Grooming booking' };
        }
    },
    async updateGroomingBooking(booking_id, updateData) {
        try {
            const existingBooking = await OtherService.findBookingById(booking_id);
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
                updateData.time_slot
            );
    
            if (available && available.booking_id !== booking_id) {
                return { error: 'Time slot not available' };
            }
    
            const isBook = await OtherService.findBooking(
                updateData.pet_id,
                updateData.booking_date,
                updateData.time_slot,
                existingBooking.service_id
            );
            if (isBook && isBook.booking_id !== booking_id) {
                return { error: 'You have already booked this slot' };
            }
    
            const updatedBooking = await OtherService.updateBooking(booking_id, {
                pet_id: updateData.pet_id,
                booking_date: updateData.booking_date,
                time_slot: updateData.time_slot,
            });
    
            return updatedBooking;
        } catch (error) {
            console.error('Error in updateGroomingBooking service:', error);
            return { error: 'Failed to update Grooming booking' };
        }
    }
    
    
};

export default GroomingService;
