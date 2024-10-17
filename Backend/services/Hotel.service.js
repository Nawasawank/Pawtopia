import { Hotel } from '../database.js'; 


export const addHotelBooking = async (userId, bookingData) => {
    try {

        const Booking = await Hotel.createHotelBooking({
            pet_id: bookingData.pet_id,
            check_in_date: bookingData.check_in_date,
            check_out_date: bookingData.check_out_date,
            room_size: bookingData.room_size
        });
        return Booking;
    } catch (error) {
        console.error(`Error adding hotel booking: ${error.message}`);
        return { error: 'Error adding hotel booking' };
    }
};

export const deleteHotelBooking = async (bookingId) => {
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
};

export const getHotelBookingById = async (bookingId) => {
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
};