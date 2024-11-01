import FeedbackService from '../services/Feedback.service.js';

const FeedbackController = {
    async createFeedback(req, res) {
        const { id: user_id } = req.user;
        const { booking_id, comment, rating, feedback_type } = req.body;
        console.log(req.body)

        try {
            const feedbackData = {
                user_id,
                booking_id: booking_id ,
                comment,
                rating,
                feedback_type
            };

            const feedback = await FeedbackService.createFeedback(feedbackData);

            if (feedback.error) {
                return res.status(500).json({ error: feedback.error });
            }

            return res.status(201).json({
                message: 'Feedback created successfully',
                feedback
            });
        } catch (error) {
            console.error(`Error in createFeedback: ${error.message}`);
            return res.status(500).json({ error: 'Failed to create feedback' });
        }
    }
};

export default FeedbackController;
