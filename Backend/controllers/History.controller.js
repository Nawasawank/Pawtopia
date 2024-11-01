import HistoryService from '../services/History.service.js';

const HistoryController = {
    async getAppointmentHistory(req, res) {
        const { id: userId } = req.user;
        const { startDate, endDate } = req.query;

        try {
            const appointments = await HistoryService.getAppointmentsWithinDateRange(userId, startDate, endDate);

            if (appointments.error) {
                return res.status(500).json({ error: appointments.error });
            }

            return res.status(200).json(appointments);
        } catch (error) {
            console.error(`Error in getAppointmentHistory: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

export default HistoryController;
