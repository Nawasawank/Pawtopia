import HotelService from '../services/Hotel.service.js';

const HotelController = {
    async addHotelBooking(req, res) {
        const { id: userId } = req.user;
        const bookingData = req.body;

        try {
            const newBooking = await HotelService.addHotelBooking(bookingData);

            if (newBooking.error) {
                return res.status(200).json({ error: newBooking.error });
            }

            return res.status(201).json({
                message: 'Hotel booking added successfully',
                booking: newBooking
            });
        } catch (error) {
            console.error(`Error in addHotelBookingController: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteHotelBooking(req, res) {
        const { bookingId } = req.params;

        try {
            const result = await HotelService.deleteHotelBooking(bookingId);

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({ message: 'Hotel booking deleted successfully' });
        } catch (error) {
            console.error(`Error in deleteHotelBookingController: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getHotelBookingById(req, res) {
        const { bookingId } = req.params;

        try {
            const booking = await HotelService.getHotelBookingById(bookingId);

            if (booking.error) {
                return res.status(404).json({ error: booking.error });
            }

            return res.status(200).json({
                message: 'Hotel booking retrieved successfully',
                booking
            });
        } catch (error) {
            console.error(`Error in getHotelBookingByIdController: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export default HotelController;
