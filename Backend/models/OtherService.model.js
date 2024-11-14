import db from '../database.js';

const ServicesBooking = {
    async createBooking(bookingData, role) {
        try {
            const insertSql = `
                INSERT INTO services_bookings (pet_id, employee_id, service_id, booking_date, time_slot) 
                VALUES (?, ?, ?, ?, ?)
            `;
            const params = [
                bookingData.pet_id,
                bookingData.employee_id,
                bookingData.service_id,
                bookingData.booking_date,
                bookingData.time_slot,
            ];

            const result = await db.query(insertSql, params, role);  // Pass role to db.query
            return await this.findBookingById(result.insertId, role);
        } catch (error) {
            console.error('Error creating service booking:', error);
            throw error;
        }
    },

    async updateBooking(booking_id, updateData, role) {
        try {
            const sql = `
                UPDATE services_bookings 
                SET pet_id = ?, booking_date = ?, time_slot = ?
                WHERE booking_id = ?
            `;
            const params = [
                updateData.pet_id,
                updateData.booking_date,
                updateData.time_slot,
                booking_id,
            ];

            await db.query(sql, params, role);  // Pass role to db.query
            return await this.findBookingById(booking_id, role);
        } catch (error) {
            console.error('Error updating service booking:', error);
            throw error;
        }
    },

    async findBookingById(booking_id, role) {
        try {
            const sql = 'SELECT * FROM services_bookings WHERE booking_id = ?';
            const bookings = await db.query(sql, [booking_id], role);  // Pass role to db.query
            return bookings[0] || null;
        } catch (error) {
            console.error('Error finding booking by ID:', error);
            throw error;
        }
    },

    async findAvailableBooking(employee_id, booking_date, time_slot, role) {
        try {
            const sql = `
                SELECT * FROM services_bookings 
                WHERE employee_id = ? AND booking_date = ? AND time_slot = ?
            `;
            const bookings = await db.query(sql, [employee_id, booking_date, time_slot], role);  // Pass role to db.query
            return bookings[0] || null;
        } catch (error) {
            console.error('Error finding available booking:', error);
            throw error;
        }
    },

    async findBooking(pet_id, booking_date, time_slot, service_id, role) {
        try {
            const sql = `
                SELECT * FROM services_bookings 
                WHERE pet_id = ? AND booking_date = ? AND time_slot = ? AND service_id = ?
            `;
            const bookings = await db.query(sql, [pet_id, booking_date, time_slot, service_id], role);  // Pass role to db.query
            return bookings[0] || null;
        } catch (error) {
            console.error('Error finding booking:', error);
            throw error;
        }
    },

    async findBookingsByPetId(petId, role) {
        try {
            const sql = 'SELECT * FROM services_bookings WHERE pet_id = ?';
            return await db.query(sql, [petId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error finding bookings by pet ID:', error);
            throw error;
        }
    },

    async deleteBooking(booking_id, role) {
        try {
            const sql = 'DELETE FROM services_bookings WHERE booking_id = ?';
            return await db.query(sql, [booking_id], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error deleting booking:', error);
            throw error;
        }
    },

    async getBookingsByDate(date, service_id, role) {
        try {
            const sql = `
                SELECT sb.booking_id, sb.booking_date, sb.time_slot, u.firstName AS customer_name, 
                       p.name AS pet_name, s.service_name, e.first_name AS employee_name
                FROM services_bookings sb
                JOIN pets p ON sb.pet_id = p.pet_id
                JOIN users u ON p.user_id = u.user_id
                JOIN services s ON sb.service_id = s.service_id
                JOIN employees e ON sb.employee_id = e.employee_id
                WHERE sb.booking_date = ? AND sb.service_id = ?
            `;
            return await db.query(sql, [date, service_id], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error fetching bookings by date:', error);
            throw error;
        }
    },
};

export default ServicesBooking;
