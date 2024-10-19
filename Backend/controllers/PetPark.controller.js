import PetParkService from '../services/PetPark.service.js';

const PetParkController = {
    async addBooking(req, res) {
        const bookingData = req.body;

        try {
            const newBooking = await PetParkService.addPetParkBooking(bookingData);

            if (newBooking.error) {
                return res.status(400).json({ error: newBooking.error });
            }

            return res.status(201).json({
                message: 'Pet Park booking added successfully',
                booking: newBooking
            });
        } catch (error) {
            console.error(`Error in addBooking: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteBooking(req, res) {
        const { bookingId } = req.params;

        try {
            const result = await PetParkService.deletePetParkBooking(bookingId);

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({ message: 'Pet Park booking deleted successfully' });
        } catch (error) {
            console.error(`Error in deleteBooking: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getBookingById(req, res) {
        const { bookingId } = req.params;

        try {
            const booking = await PetParkService.getPetParkBookingById(bookingId);

            if (booking.error) {
                return res.status(404).json({ error: booking.error });
            }

            return res.status(200).json({
                message: 'Pet Park booking retrieved successfully',
                booking
            });
        } catch (error) {
            console.error(`Error in getBookingById: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export default PetParkController;
