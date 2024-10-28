import PetParkService from '../services/PetPark.service.js';

const PetParkController = {
    async addBooking(req, res) {
        const bookingData = req.body;

        try {
            const newBooking = await PetParkService.addPetParkBooking(bookingData);

            if (newBooking.error) {
                return res.status(200).json({ error: newBooking.error });
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
        const { booking_id } = req.params;

        try {
            const result = await PetParkService.deletePetParkBooking(booking_id);

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
        const { booking_id } = req.params;

        try {
            const booking = await PetParkService.getPetParkBookingById(booking_id);

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
    },
    async updateBooking(req, res) {
        const { booking_id } = req.params;
        const updateData = req.body;
        console.log(booking_id)
        

        try {
            const updatedBooking = await PetParkService.updatePetParkBooking(booking_id, updateData);

            if (updatedBooking.error) {
                return res.status(400).json({ error: updatedBooking.error });
            }

            return res.status(200).json({
                message: 'Grooming booking updated successfully',
                booking: updatedBooking
            });
        } catch (error) {
            console.error(`Error in updateBooking: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export default PetParkController;
