import Admin from '../models/Admin.model.js';
import CustomerFeedback from '../models/CustomerFeedbacks.js';

const FeedbackService = {
    async createFeedback(feedbackData, role) {
        try {
            const randomAdminResult = await Admin.findRandomAdminId(role);  // Pass role to model

            if (!randomAdminResult || !randomAdminResult.employee_id) {
                throw new Error('No admin found in the database or invalid admin data');
            }

            const randomAdminId = randomAdminResult.employee_id;
            feedbackData.employee_id = randomAdminId;

            const feedbackResult = await CustomerFeedback.createFeedback(feedbackData, role);  // Pass role to model
            return feedbackResult;
        } catch (error) {
            console.error(`Error creating feedback: ${error.message}`);
            return { error: 'Error creating feedback' };
        }
    },

    async getFeedback(serviceId, role) {
        if (!serviceId) {
            return { error: 'service_id is required to retrieve feedback' };
        }

        try {
            const feedbackResult = await CustomerFeedback.getFeedback(serviceId, role);  // Pass role to model
            return feedbackResult;
        } catch (error) {
            console.error(`Error retrieving feedback: ${error.message}`);
            return { error: 'Error retrieving feedback' };
        }
    },

    async createTechnicalFeedback(feedbackData, role) {
        try {
            const feedbackResult = await CustomerFeedback.createTechnicalFeedback(feedbackData, role);  // Pass role to model
            return feedbackResult;
        } catch (error) {
            console.error(`Error creating technical feedback: ${error.message}`);
            return { error: 'Error creating technical feedback' };
        }
    },

    async getFeedbackByTypeAndDate(type, startDate, endDate, role) {
        try {
            const feedbackResults = await CustomerFeedback.findFeedbackByTypeAndDate(type, startDate, endDate, role);  // Pass role to model
            return feedbackResults;
        } catch (error) {
            console.error(`Error retrieving feedback: ${error.message}`);
            return { error: 'Error retrieving feedback' };
        }
    }
};

export default FeedbackService;
