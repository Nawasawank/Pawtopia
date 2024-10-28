import { Hotel } from '../database.js';

const HotelService = {
    async addHotelBooking(bookingData) {
        try {
            const existingBooking = await Hotel.findHotelBookingsByPetId(bookingData.pet_id, bookingData.check_in_date,bookingData.check_out_date);
            
            if (new Date(bookingData.check_in_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
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
    

    async deleteHotelBooking(booking_id) {
        try {
            const result = await Hotel.deleteHotelBooking(booking_id);

            if (!result) {
                return { error: 'Booking not found or unable to delete' };
            }

            return result;
        } catch (error) {
            console.error(`Error deleting hotel booking: ${error.message}`);
            return { error: 'Error deleting hotel booking' };
        }
    },

    async getHotelBookingById(booking_id) {
        try {
            console.log(booking_id)
            const booking = await Hotel.findHotelBookingById(booking_id);

            if (!booking) {
                return { error: 'Booking not found' };
            }

            return booking;
        } catch (error) {
            console.error(`Error fetching hotel booking: ${error.message}`);
            return { error: 'Error fetching hotel booking' };
        }
    },
       async updateHotelBooking(booking_id, updateData) {
        try {
            const existingBooking = await Hotel.findHotelBookingsByPetId(
                updateData.pet_id,
                updateData.check_in_date,
                updateData.check_out_date
            );

            if (existingBooking && existingBooking.hotel_booking_id !== booking_id) {
                return { error: 'This pet is already booked for these dates' };
            }
            console.log(booking_id)
            const result = await Hotel.updateHotelBooking(booking_id, {
                pet_id: updateData.pet_id,
                check_in_date: updateData.check_in_date,
                check_out_date: updateData.check_out_date,
                room_size: updateData.room_size,
            });

            return result;
        } catch (error) {
            console.error(`Error updating hotel booking: ${error.message}`);
            return { error: 'Error updating hotel booking' };
        }
    },
}

export default HotelService;
