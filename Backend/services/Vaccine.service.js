import { OtherService, Employee } from '../database.js';

const VaccineService = {
    async addVaccineBooking(bookingData) {
        try {
            const employee = await Employee.getRandomEmployeeForService(3);
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

    async deleteVaccineBooking(booking_id) {
        try {
            const result = await OtherService.deleteBooking(booking_id);
            return result;
        } catch (error) {
            console.error('Error in deleteVaccineBooking service:', error);
            return { error: 'Failed to delete vaccine booking' };
        }
    },

    async getVaccineBookingById(bookingId) {
        try {
            const booking = await OtherService.findBookingById(bookingId);
            return booking;
        } catch (error) {
            console.error('Error in getVaccineBookingById service:', error);
            return { error: 'Failed to retrieve vaccine booking' };
        }
    },
    async updateVaccineBooking(booking_id, updateData) {
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
            console.error('Error in updateVaccineBooking service:', error);
            return { error: 'Failed to update Vaccine booking' };
        }
    }
};

export default VaccineService;
