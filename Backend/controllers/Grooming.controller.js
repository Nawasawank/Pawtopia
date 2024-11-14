import GroomingService from '../services/Grooming.Service.js';

const GroomingController = {
    async addBooking(req, res) {
        const { role } = req.user;  // Extract role from the request
        const bookingData = req.body;

        try {
            const newBooking = await GroomingService.addGroomingBooking(bookingData, role);  // Pass role to service

            if (newBooking.error) {
                return res.status(200).json({ error: newBooking.error });
            }

            return res.status(201).json({
                message: 'Grooming booking added successfully',
                booking: newBooking
            });
        } catch (error) {
            console.error(`Error in addBooking: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteBooking(req, res) {
        const { role } = req.user;  // Extract role from the request
        const { booking_id } = req.params;

        try {
            const result = await GroomingService.deleteGroomingBooking(booking_id, role);  // Pass role to service

            if (result.error) {
                return res.status(200).json({ error: result.error });
            }

            return res.status(200).json({ message: 'Grooming booking deleted successfully' });
        } catch (error) {
            console.error(`Error in deleteBooking: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getBookingById(req, res) {
        const { role } = req.user;  // Extract role from the request
        const { booking_id } = req.params;

        console.log(booking_id);
        try {
            const booking = await GroomingService.getGroomingBookingById(booking_id, role);  // Pass role to service

            if (booking.error) {
                return res.status(404).json({ error: booking.error });
            }

            return res.status(200).json({
                message: 'Grooming booking retrieved successfully',
                booking
            });
        } catch (error) {
            console.error(`Error in getBookingById: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async updateBooking(req, res) {
        const { role } = req.user;  // Extract role from the request
        const { booking_id } = req.params;
        const updateData = req.body;
        console.log(booking_id);

        try {
            const updatedBooking = await GroomingService.updateGroomingBooking(booking_id, updateData, role);  // Pass role to service

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

export default GroomingController;
