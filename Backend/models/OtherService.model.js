export default function OtherServicesBookingModel(db) {
    const OtherServicesBooking = {
        createTable: async () => {
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

        createBooking: async (bookingData) => {
            try {
                const sql = `
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

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error creating service booking:', error);
                throw error;
            }
        },

        updateBooking: async (bookingId, updateData) => {
            try {
                const sql = `
                    UPDATE other_services_bookings 
                    SET pet_id = ?, employee_id = ?, service_id = ?, booking_date = ?, time_slot = ?
                    WHERE booking_id = ?
                `;
                const params = [
                    updateData.pet_id,
                    updateData.employee_id,
                    updateData.service_id,
                    updateData.booking_date,
                    updateData.time_slot,
                    bookingId
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error updating service booking:', error);
                throw error;
            }
        },

        findBookingById: async (bookingId) => {
            const sql = 'SELECT * FROM other_services_bookings WHERE booking_id = ?';
            const bookings = await db.query(sql, [bookingId]);
            return bookings[0];
        },

        findBookingsByPetId: async (petId) => {
            const sql = 'SELECT * FROM other_services_bookings WHERE pet_id = ?';
            return db.query(sql, [petId]);
        },

        deleteBooking: async (bookingId) => {
            const sql = 'DELETE FROM other_services_bookings WHERE booking_id = ?';
            return db.query(sql, [bookingId]);
        }
    };

    return OtherServicesBooking;
}
