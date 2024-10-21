import { Hotel } from '../database.js';

const HotelService = {
    async addHotelBooking(bookingData) {
        try {
            const existingBooking = await Hotel.findHotelBookingsByPetId(bookingData.pet_id, bookingData.check_in_date,bookingData.check_out_date);
            
            if (new Date(bookingData.check_in_date) < Date.now() ) {
                return { error: 'You cannot book a date in the past' };
            }

            if (existingBooking) {
                return { error: 'You have already booked this pet' };
            }
            else{
            const booking = await Hotel.createHotelBooking({
                pet_id: bookingData.pet_id,
                check_in_date: bookingData.check_in_date,
                check_out_date: bookingData.check_out_date,
                room_size: bookingData.room_size
            });
    
            return booking;}
        } catch (error) {
            console.error(`Error adding hotel booking: ${error.message}`);
            return { error: 'Error adding hotel booking' };
        }
    },
    

    async deleteHotelBooking(bookingId) {
        try {
            const result = await Hotel.deleteHotelBooking(bookingId);

            if (!result) {
                return { error: 'Booking not found or unable to delete' };
            }

            return result;
        } catch (error) {
            console.error(`Error deleting hotel booking: ${error.message}`);
            return { error: 'Error deleting hotel booking' };
        }
    },

    async getHotelBookingById(bookingId) {
        try {
            const booking = await Hotel.findHotelBookingById(bookingId);

            if (!booking) {
                return { error: 'Booking not found' };
            }

            return booking;
        } catch (error) {
            console.error(`Error fetching hotel booking: ${error.message}`);
            return { error: 'Error fetching hotel booking' };
        }
    }
};

export default HotelService;
