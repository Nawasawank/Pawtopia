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
