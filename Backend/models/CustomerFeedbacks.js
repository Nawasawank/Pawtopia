import db from '../database.js';  // Import db.query

const CustomerFeedback = {
    async createFeedback(feedbackData, role) {
        try {
            console.log(feedbackData)
            const sql = `
                INSERT INTO customer_feedback (user_id, booking_id, comment, rating, feedback_type, employee_id) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const params = [
                feedbackData.user_id,
                feedbackData.booking_id,
                feedbackData.comment,
                feedbackData.rating,
                feedbackData.feedback_type,
                feedbackData.employee_id,
            ];

            const result = await db.query(sql, params, role);  // Pass role to db.query
            return {
                ...feedbackData,
                feedback_id: result.insertId,
            };
        } catch (error) {
            console.error('Error creating feedback:', error);
            throw error;
        }
    },

    async updateFeedback(feedbackId, updateData, role) {
        try {
            const sql = `
                UPDATE customer_feedback 
                SET user_id = ?, booking_id = ?, comment = ?, rating = ?, feedback_type = ?, employee_id = ? 
                WHERE feedback_id = ?
            `;
            const params = [
                updateData.user_id,
                updateData.booking_id,
                updateData.comment,
                updateData.rating,
                updateData.feedback_type,
                updateData.employee_id,
                feedbackId,
            ];

            const result = await db.query(sql, params, role);  
            return result;
        } catch (error) {
            console.error('Error updating feedback:', error);
            throw error;
        }
    },

    async findFeedbackById(feedbackId, role) {
        try {
            const sql = 'SELECT * FROM customer_feedback WHERE feedback_id = ?';
            const feedbacks = await db.query(sql, [feedbackId], role); 
            return feedbacks[0];
        } catch (error) {
            console.error('Error finding feedback by ID:', error);
            throw error;
        }
    },

    async findFeedbackByBookingId(bookingId, role) {
        try {
            const sql = 'SELECT * FROM customer_feedback WHERE booking_id = ?';
            const feedbacks = await db.query(sql, [bookingId], role);  
            return feedbacks;
        } catch (error) {
            console.error('Error finding feedback by booking ID:', error);
            throw error;
        }
    },

    async deleteFeedback(feedbackId, role) {
        try {
            const sql = 'DELETE FROM customer_feedback WHERE feedback_id = ?';
            return await db.query(sql, [feedbackId], role);  
        } catch (error) {
            console.error('Error deleting feedback:', error);
            throw error;
        }
    },

    async getFeedback(serviceId, role) {
        try {
            const sql = `
            SELECT 
                customer_feedback.*, 
                services_bookings.service_id, 
                users.firstname
            FROM 
                customer_feedback 
            JOIN 
                services_bookings 
            ON 
                customer_feedback.booking_id = services_bookings.booking_id
            JOIN 
                users 
            ON 
                customer_feedback.user_id = users.user_id
            WHERE 
                services_bookings.service_id = ?
                AND customer_feedback.comment IS NOT NULL
                AND customer_feedback.comment != ''
            LIMIT 4;
        `;
            return await db.query(sql, [serviceId], role);  
        } catch (error) {
            console.error('Error retrieving feedback:', error);
            throw error;
        }
    },

    async createTechnicalFeedback(feedbackData, role) {
        try {
            const sql = `
                INSERT INTO customer_feedback (user_id, comment, feedback_type) 
                VALUES (?, ?, ?)
            `;
            const params = [
                feedbackData.user_id,
                feedbackData.comment,
                feedbackData.feedback_type,
            ];

            const result = await db.query(sql, params, role);  
            return {
                ...feedbackData,
                feedback_id: result.insertId,
            };
        } catch (error) {
            console.error('Error creating technical feedback:', error);
            throw error;
        }
    },

    async findFeedbackByTypeAndDate(feedbackType, startDate, endDate, role) {
        try {
            const sql = `
                SELECT customer_feedback.*, users.firstName, users.lastName 
                FROM customer_feedback 
                JOIN users ON users.user_id = customer_feedback.user_id
                WHERE feedback_type = ? 
                AND DATE(customer_feedback.created_at) BETWEEN ? AND ?
            `;
            const result = await db.query(sql, [feedbackType, startDate, endDate], role);  
            return result;
        } catch (error) {
            console.error('Error retrieving feedback by type and date:', error);
            throw error;
        }
    },
};

export default CustomerFeedback;
