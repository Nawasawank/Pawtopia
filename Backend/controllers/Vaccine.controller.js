import VaccineService from '../services/Vaccine.service.js';

const VaccineController = {
    async addBooking(req, res) {
        const bookingData = req.body;

        try {
            const newBooking = await VaccineService.addVaccineBooking(bookingData);

            if (newBooking.error) {
                return res.status(400).json({ error: newBooking.error });
            }

            return res.status(201).json({
                message: 'Vaccine booking added successfully',
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
            const result = await VaccineService.deleteVaccineBooking(bookingId);

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({ message: 'Vaccine booking deleted successfully' });
        } catch (error) {
            console.error(`Error in deleteBooking: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getBookingById(req, res) {
        const { bookingId } = req.params;

        try {
            const booking = await VaccineService.getVaccineBookingById(bookingId);

            if (booking.error) {
                return res.status(404).json({ error: booking.error });
            }

            return res.status(200).json({
                message: 'Vaccine booking retrieved successfully',
                booking
            });
        } catch (error) {
            console.error(`Error in getBookingById: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export default VaccineController;
