import FeedbackService from '../services/Feedback.service.js';

const FeedbackController = {
    async createFeedback(req, res) {
        const { id: user_id } = req.user;
        const { booking_id, comment, rating, feedback_type } = req.body;
        console.log(req.body);

        try {
            const feedbackData = {
                user_id,
                booking_id: booking_id,
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
    },

    async getFeedback(req, res) {
        const { service_id } = req.params;  // Extract service_id from route parameters
    
        if (!service_id) {
            return res.status(400).json({ error: 'service_id is required to retrieve feedback' });
        }
    
        try {
            // Retrieve feedback data for the specified service_id
            const feedback = await FeedbackService.getFeedback(parseInt(service_id));
    
            if (!feedback || feedback.error) {
                return res.status(404).json({ error: 'No feedback found for the specified service_id' });
            }
    
            // Return feedback data if found
            return res.status(200).json({
                message: 'Feedback retrieved successfully',
                feedback
            });
        } catch (error) {
            console.error(`Error in getFeedback: ${error.message}`);
            return res.status(500).json({ error: 'Failed to retrieve feedback' });
        }
    },

    async createTechnicalFeedback(req, res) {
        const { id: user_id } = req.user;
        const {  comment, feedback_type } = req.body;
    
        try {
            const feedbackData = {
                user_id,
                comment,
                feedback_type,
            };
    
            const feedback = await FeedbackService.createTechnicalFeedback(feedbackData);
            console.log("Feedback: ");
            
    
            if (feedback.error) {
                return res.status(500).json({ error: feedback.error });
            }
    
            return res.status(201).json({
                message: 'Technical feedback created successfully',
                feedback
            });
        } catch (error) {
            console.error(`Error in createTechnicalFeedback: ${error.message}`);
            return res.status(500).json({ error: 'Failed to create technical feedback' });
        }
    }
    
};    

export default FeedbackController;
