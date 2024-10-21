export default function HotelBookingModel(db) {
    const Hotel = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS hotel_service_booking (
                    hotel_booking_id INT AUTO_INCREMENT PRIMARY KEY,
                    pet_id INT,
                    check_in_date DATE,
                    check_out_date DATE,
                    room_size VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE
                );
            `;
            await db.query(sql);
        },

        async createHotelBooking(bookingData) {
            try {
                const sql = `
                    INSERT INTO hotel_service_booking (pet_id, check_in_date, check_out_date, room_size) 
                    VALUES (?, ?, ?, ?)
                `;
                const params = [
                    bookingData.pet_id,
                    bookingData.check_in_date,
                    bookingData.check_out_date,
                    bookingData.room_size
                ];

                const result = await db.query(sql, params);
                const newBooking = await Hotel.findHotelBookingById(result.insertId);

                return newBooking;
            } catch (error) {
                console.error('Error creating hotel booking:', error);
                throw error;
            }
        },

        async updateHotelBooking(bookingId, updateData) {
            try {
                const sql = `
                    UPDATE hotel_service_booking 
                    SET pet_id = ?, check_in_date = ?, check_out_date = ?, room_size = ?
                    WHERE hotel_booking_id = ?
                `;
                const params = [
                    updateData.pet_id,
                    updateData.check_in_date,
                    updateData.check_out_date,
                    updateData.room_size,
                    bookingId
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error updating hotel booking:', error);
                throw error;
            }
        },

        async findHotelBookingById(bookingId) {
            const sql = 'SELECT * FROM hotel_service_booking WHERE hotel_booking_id = ?';
            const bookings = await db.query(sql, [bookingId]);
            return bookings[0];
        },

        async findHotelBookingsByPetId(petId, check_in_date, check_out_date) {
            const sql = `
                SELECT * 
                FROM hotel_service_booking 
                WHERE pet_id = ? 
                AND (
                    (check_in_date <= ? AND check_out_date >= ?) 
                    OR (check_in_date <= ? AND check_out_date >= ?)
                )`;
            const bookings = await db.query(sql, [petId, check_out_date, check_in_date, check_in_date, check_out_date]);
            return bookings[0];
        },
        

        async deleteHotelBooking(bookingId) {
            const sql = 'DELETE FROM hotel_service_booking WHERE hotel_booking_id = ?';
            return db.query(sql, [bookingId]);
        }
    };

    return Hotel;
}
