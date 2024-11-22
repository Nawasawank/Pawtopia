import db from '../database.js';

const User = {
    async createUser(userData, role) {
        try {
            const sql = `
                INSERT INTO users (firstName, lastName, email, tel, password, image) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const params = [
                userData.firstName,
                userData.lastName,
                userData.email,
                userData.tel,
                userData.password,
                userData.image || null,
            ];

            const result = await db.query(sql, params, role);  // Pass role to db.query
            return await this.findUserById(result.insertId, role); // Return the created user
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    async updateUser(userId, updateData, role) {
        try {
            const sql = `
                UPDATE users 
                SET firstName = ?, lastName = ?, email = ?, tel = ?, password = ?
                WHERE user_id = ?
            `;
            const params = [
                updateData.firstName,
                updateData.lastName,
                updateData.email,
                updateData.tel,
                updateData.password,
                userId,
            ];

            await db.query(sql, params, role);  // Pass role to db.query
            return await this.findUserById(userId, role); // Return the updated user
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    async findUserByEmail(email, role) {
        try {
            const sql = 'SELECT * FROM users WHERE email = ?';
            const users = await db.query(sql, [email], role);  // Pass role to db.query
            return users[0] || null; // Return null if no user is found
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    },

    async findUserById(userId, role) {
        try {
            const sql = 'SELECT * FROM users WHERE user_id = ?';
            const users = await db.query(sql, [userId], role);  // Pass role to db.query
            return users[0] || null; // Return null if no user is found
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    },

    async findUserByTel(tel, role) {
        try {
            const sql = 'SELECT * FROM users WHERE tel = ?';
            const users = await db.query(sql, [tel], role);  // Pass role to db.query
            return users[0] || null; // Return null if no user is found
        } catch (error) {
            console.error('Error finding user by telephone:', error);
            throw error;
        }
    },

    async getUserWithPets(userId, role) {
        try {
            const sql = `
                SELECT users.*, pets.pet_id, pets.name AS pet_name, pets.type AS pet_type, 
                       pets.gender AS pet_gender, pets.weight AS pet_weight, 
                       pets.health_condition_id, health_conditions.health_condition
                FROM users
                LEFT JOIN pets ON users.user_id = pets.user_id
                LEFT JOIN health_conditions ON pets.health_condition_id = health_conditions.health_condition_id
                WHERE users.user_id = ?
            `;
            const rows = await db.query(sql, [userId], role);  // Pass role to db.query

            if (rows.length === 0) {
                return null;
            }

            const user = {
                user_id: rows[0].user_id,
                firstName: rows[0].firstName,
                lastName: rows[0].lastName,
                email: rows[0].email,
                tel: rows[0].tel,
                image: rows[0].image,
                pets: rows
                    .filter(row => row.pet_id !== null)
                    .map(row => ({
                        pet_id: row.pet_id,
                        name: row.pet_name,
                        type: row.pet_type,
                        gender: row.pet_gender,
                        weight: row.pet_weight,
                        health_condition: row.health_condition,
                    })),
            };

            return user;
        } catch (error) {
            console.error('Error getting user with pets:', error);
            throw error;
        }
    },

    async updateUserImage(userId, imagePath, role) {
        try {
            const sql = `
                UPDATE users 
                SET image = ?
                WHERE user_id = ?
            `;
            const params = [imagePath, userId];

            await db.query(sql, params, role);  // Pass role to db.query
            return await this.findUserById(userId, role); // Return the updated user
        } catch (error) {
            console.error('Error updating user image:', error);
            throw error;
        }
    },

    async getUserBookings(userId, startDate, endDate, role) {
        try {
            const sql = `
                SELECT 
                    p.name AS pet_name,
                    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                    s.service_name,
                    o.booking_id,
                    o.booking_date AS date
                FROM services_bookings o
                JOIN pets p ON o.pet_id = p.pet_id
                JOIN employees e ON o.employee_id = e.employee_id
                JOIN services s ON o.service_id = s.service_id
                WHERE p.user_id = ?
                AND (o.booking_date BETWEEN ? AND ?)
            `;
            const params = [userId, startDate, endDate];
            return await db.query(sql, params, role);  // Pass role to db.query
        } catch (error) {
            console.error('Error getting user bookings:', error);
            throw error;
        }
    },

    async getAllUsersWithPetCount(role) {
        try {
            const sql = `
                SELECT users.user_id, users.firstName, users.lastName, users.email, users.tel, users.image,
                       COUNT(pets.pet_id) AS pet_count
                FROM users
                LEFT JOIN pets ON users.user_id = pets.user_id
                GROUP BY users.user_id
            `;
            const rows = await db.query(sql, [], role);  // Pass role to db.query

            return rows.map(row => ({
                user_id: row.user_id,
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email,
                tel: row.tel,
                image: row.image,
                pet_count: row.pet_count,
            }));
        } catch (error) {
            console.error('Error getting all users with pet count:', error);
            throw error;
        }
    },
};

export default User;
