export default function CustomerFeedbackModel(db) {
    const CustomerFeedback = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS customer_feedback (
                    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    booking_id INT NOT NULL,
                    comment TEXT,
                    rating INT NULL,
                    feedback_type ENUM('General', 'Technical'),
                    employee_id INT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                    FOREIGN KEY (booking_id) REFERENCES services_bookings(booking_id) ON DELETE CASCADE,
                    FOREIGN KEY (employee_id) REFERENCES emp_admins(employee_id) ON DELETE SET NULL
                );
            `;
            await db.query(sql);
        },

        async createFeedback(feedbackData) {
            try {
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
                    feedbackData.employee_id
                ];

                const result = await db.query(sql, params);
                return {
                    ...feedbackData,
                };
            } catch (error) {
                console.error('Error creating feedback:', error);
                throw error;
            }
        },

        async updateFeedback(feedbackId, updateData) {
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
                    feedbackId
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error updating feedback:', error);
                throw error;
            }
        },

        async findFeedbackById(feedbackId) {
            const sql = 'SELECT * FROM customer_feedback WHERE feedback_id = ?';
            const feedbacks = await db.query(sql, [feedbackId]);
            return feedbacks[0];
        },

        async findFeedbackByBookingId(bookingId) {
            const sql = 'SELECT * FROM customer_feedback WHERE booking_id = ?';
            return db.query(sql, [bookingId]);
        },
        
        async deleteFeedback(feedbackId) {
            const sql = 'DELETE FROM customer_feedback WHERE feedback_id = ?';
            return db.query(sql, [feedbackId]);
        }
    };

    return CustomerFeedback;
}
