import { CustomerFeedback } from '../database.js'; 
import { Admin } from '../database.js'; 



const FeedbackService = {
    async createFeedback(feedbackData) {
        try {
            const randomAdminResult = await Admin.findRandomAdminId();
            console.log(randomAdminResult)
            if (!randomAdminResult || randomAdminResult.length === 0) {
                throw new Error('No admin found in the database');
            }

            const randomAdminId = randomAdminResult[0].employee_id;
            console.log(randomAdminId)

            feedbackData.employee_id = randomAdminId;

            const feedbackResult = await CustomerFeedback.createFeedback(feedbackData);
            return feedbackResult;
        } catch (error) {
            console.error(`Error creating feedback: ${error.message}`);
            return { error: 'Error creating feedback' };
        }
    },

    async getFeedback(serviceId) {
        if (!serviceId) {
            return { error: 'service_id is required to retrieve feedback' };
        }

        try {
            // Retrieves feedback only for the specified service ID
            const feedbackResult = await CustomerFeedback.getFeedback(serviceId);
            return feedbackResult;
        } catch (error) {
            console.error(`Error retrieving feedback: ${error.message}`);
            return { error: 'Error retrieving feedback' };
        }
    },

    async createTechnicalFeedback(feedbackData) {
        try {

            const feedbackResult = await CustomerFeedback.createTechnicalFeedback(feedbackData);
            return feedbackResult;
        } catch (error) {
            console.error(`Error creating technical feedback: ${error.message}`);
            return { error: 'Error creating technical feedback' };
        }
    },
    async getFeedbackByTypeAndDate(type, startDate, endDate) {
        try {
            console.log(type)
            const feedbackResults = await CustomerFeedback.findFeedbackByTypeAndDate(type, startDate, endDate);
            return feedbackResults;
        } catch (error) {
            console.error(`Error retrieving feedback: ${error.message}`);
            return { error: 'Error retrieving feedback' };
        }
    }
};

export default FeedbackService;
