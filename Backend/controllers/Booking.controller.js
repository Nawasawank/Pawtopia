import bookingsService from '../services/Booking.service.js';

const bookingsController = {
    async getBookingsByDate(req, res) {
        try {
            const { date } = req.query;
            if (!date) {
                return res.status(400).json({ error: "Date parameter is required" });
            }
            const bookings = await bookingsService.getBookingsByDate(date);
            res.status(200).json(bookings);
        } catch (error) {
            console.error("Error in bookingsController - getBookingsByDate:", error);
            res.status(500).json({ error: "An error occurred while fetching bookings." });
        }
    },
    async addBooking(req, res) {
        const { service_id } = req.params; 
        const bookingData = req.body;

        try {
            const newBooking = await bookingsService.addBooking(bookingData, service_id);

            if (newBooking.error) {
                return res.status(400).json({ error: newBooking.error });
            }

            return res.status(201).json({
                message: `Booking added successfully for service ${service_id}`,
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
            const result = await bookingsService.deleteBooking(booking_id);

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({ message: 'Booking deleted successfully' });
        } catch (error) {
            console.error(`Error in deleteBooking: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getBookingById(req, res) {
        const { booking_id } = req.params;
    
        try {
            const booking = await bookingsService.getBookingById(booking_id);
    
            if (!booking) {
                return res.status(404).json({ error: 'Booking not found' });
            }
    
            return res.status(200).json({
                message: 'Booking retrieved successfully',
                booking
            });
        } catch (error) {
            console.error(`Error in getBookingById: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },    

    async updateBooking(req, res) {
        const { booking_id, service_id } = req.params;
        const updateData = req.body;

        try {
            const updatedBooking = await bookingsService.updateBooking(booking_id, updateData);

            if (updatedBooking.error) {
                return res.status(400).json({ error: updatedBooking.error });
            }

            return res.status(200).json({
                message: `Booking updated successfully for service ${service_id}`,
                booking: updatedBooking
            });
        } catch (error) {
            console.error(`Error in updateBooking: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export default bookingsController;
