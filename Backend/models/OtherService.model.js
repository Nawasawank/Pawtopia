export default function OtherServicesBookingModel(db) {
    const OtherServicesBooking = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS other_services_bookings (
                    booking_id INT AUTO_INCREMENT PRIMARY KEY,
                    pet_id INT,
                    employee_id INT,
                    service_id INT,
                    booking_date DATE,
                    time_slot VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE,
                    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
                    FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE
                );
            `;
            await db.query(sql);
        },

        async createBooking(bookingData) {
            try {
                const insertSql = `
                    INSERT INTO other_services_bookings (pet_id, employee_id, service_id, booking_date, time_slot) 
                    VALUES (?, ?, ?, ?, ?)
                `;
                const params = [
                    bookingData.pet_id,
                    bookingData.employee_id,
                    bookingData.service_id,
                    bookingData.booking_date,
                    bookingData.time_slot
                ];

                const insertResult = await db.query(insertSql, params);

                const newBooking = await OtherServicesBooking.findBookingById(insertResult.insertId);

                return newBooking;
            } catch (error) {
                console.error('Error creating service booking:', error);
                throw error;
            }
        },

        async updateBooking(booking_id, updateData) {
            try {
                const sql = `
                    UPDATE other_services_bookings 
                    SET pet_id = ?, booking_date = ?, time_slot = ?
                    WHERE booking_id = ?
                `;
                const params = [
                    updateData.pet_id,
                    updateData.booking_date,
                    updateData.time_slot,
                    booking_id
                ];
        
                const result = await db.query(sql, params);
                
                console.log("Update result:", result);

        
                return updateData ;
            } catch (error) {
                console.error('Error updating service booking:', error);
                return { error: 'Database error occurred while updating booking' };
            }
        },              

        async findBookingById(booking_id) {
            const sql = 'SELECT * FROM other_services_bookings WHERE booking_id = ?';
            const bookings = await db.query(sql, [booking_id]);
            return bookings[0];
        },

        async findAvailableBooking(employee_id, booking_date, time_slot) {
            const sql = `
                SELECT * FROM other_services_bookings 
                WHERE employee_id = ? AND booking_date = ? AND time_slot = ?
            `;
            const bookings = await db.query(sql, [employee_id, booking_date, time_slot]);
            return bookings.length > 0 ? bookings[0] : null;
        },

        async findBooking(pet_id, booking_date, time_slot, service_id) {
            const sql = `
                SELECT * FROM other_services_bookings 
                WHERE pet_id = ? AND booking_date = ? AND time_slot = ? AND service_id =?
            `;
            const bookings = await db.query(sql, [pet_id, booking_date, time_slot,service_id]);
            return bookings.length > 0 ? bookings[0] : null;
        },

        async findBookingsByPetId(petId) {
            const sql = 'SELECT * FROM other_services_bookings WHERE pet_id = ?';
            return db.query(sql, [petId]);
        },

        async deleteBooking(booking_id) {
            const sql = 'DELETE FROM other_services_bookings WHERE booking_id = ?';
            return db.query(sql, [booking_id]);
        },
    };

    return OtherServicesBooking;
}
