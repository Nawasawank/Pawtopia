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
        const { booking_id } = req.params;

        try {
            const result = await HotelService.deleteHotelBooking(booking_id);

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
        const { booking_id } = req.params;

        try {
            const booking = await HotelService.getHotelBookingById(booking_id);

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
    },
    async updateHotelBooking(req, res) {
        const { booking_id } = req.params;
        const updateData = req.body;

        try {
            const updatedBooking = await HotelService.updateHotelBooking(booking_id, updateData);

            if (updatedBooking.error) {
                return res.status(400).json({ error: updatedBooking.error });
            }

            return res.status(200).json({
                message: 'Hotel booking updated successfully',
                booking: updatedBooking,
            });
        } catch (error) {
            console.error(`Error in updateHotelBookingController: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export default HotelController;
