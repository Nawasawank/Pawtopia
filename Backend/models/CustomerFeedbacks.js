export default function CustomerFeedbackModel(db) {
    const CustomerFeedback = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS customer_feedback (
                    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT,
                    booking_id INT NULL,
                    hotel_booking_id INT NULL,
                    comment TEXT,
                    rating INT NULL,
                    feedback_type ENUM('General', 'Technical'),
                    admin_id INT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                    FOREIGN KEY (booking_id) REFERENCES other_services_bookings(booking_id) ON DELETE SET NULL,
                    FOREIGN KEY (hotel_booking_id) REFERENCES hotel_service_booking(hotel_booking_id) ON DELETE SET NULL,
                    FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE SET NULL
                );
            `;
            await db.query(sql);
        },

        async createFeedback(feedbackData) {
            try {
                const sql = `
                    INSERT INTO customer_feedback (user_id, booking_id, hotel_booking_id, comment, rating, feedback_type, admin_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                const params = [
                    feedbackData.user_id,
                    feedbackData.booking_id || null,
                    feedbackData.hotel_booking_id || null,  
                    feedbackData.comment,
                    feedbackData.rating,
                    feedbackData.feedback_type,
                    feedbackData.admin_id
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
                    SET user_id = ?, booking_id = ?, hotel_booking_id = ?, comment = ?, rating = ?, feedback_type = ?, admin_id = ? 
                    WHERE feedback_id = ?
                `;
                const params = [
                    updateData.user_id,
                    updateData.booking_id || null,
                    updateData.hotel_booking_id || null, 
                    updateData.comment,
                    updateData.rating,
                    updateData.feedback_type, // 'General' or 'Technical'
                    updateData.admin_id || null,
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

        async findFeedbackByHotelBookingId(hotelBookingId) {
            const sql = 'SELECT * FROM customer_feedback WHERE hotel_booking_id = ?';
            return db.query(sql, [hotelBookingId]);
        },
        
        async deleteFeedback(feedbackId) {
            const sql = 'DELETE FROM customer_feedback WHERE feedback_id = ?';
            return db.query(sql, [feedbackId]);
        }
    };

    return CustomerFeedback;
}
