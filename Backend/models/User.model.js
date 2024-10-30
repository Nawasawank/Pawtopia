import bcrypt from 'bcrypt';

export default function UserModel(db) {
    const User = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS users (
                    user_id INT AUTO_INCREMENT PRIMARY KEY,
                    firstName VARCHAR(255) NOT NULL,
                    lastName VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    tel VARCHAR(50) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    image VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                );
            `;
            await db.query(sql);
        },

        async createUser(userData) {
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
                    userData.image || null 
                ];
                
                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error creating user:', error);
                throw error;
            }
        },

        async updateUser(userId, updateData) {
            try {
                if (updateData.password) {
                    const salt = await bcrypt.genSalt(10);
                    updateData.password = await bcrypt.hash(updateData.password, salt);
                }

                const sql = `
                    UPDATE users 
                    SET firstName = ?, lastName = ?, email = ?, tel = ?, password = ?, image = ?
                    WHERE user_id = ?
                `;
                const params = [
                    updateData.firstName,
                    updateData.lastName,
                    updateData.email,
                    updateData.tel,
                    updateData.password,
                    updateData.image || null,
                    userId
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error updating user:', error);
                throw error;
            }
        },

        async findUserByEmail(email) {
            const sql = 'SELECT * FROM users WHERE email = ?';
            const users = await db.query(sql, [email]);
            return users[0]; 
        },

        async findUserById(userId) {
            const sql = 'SELECT * FROM users WHERE user_id = ?';
            const users = await db.query(sql, [userId]);
            return users[0];
        },

        async findUserByTel(tel) {
            const sql = 'SELECT * FROM users WHERE tel = ?';
            const users = await db.query(sql, [tel]);
            return users[0]; 
        },

        async getUserWithPets(userId) {
            const userSql = 'SELECT * FROM users WHERE user_id = ?';
            const user = await db.query(userSql, [userId]);

            const petsSql = 'SELECT * FROM pets WHERE user_id = ?';
            const pets = await db.query(petsSql, [userId]);

            if (user.length > 0) {
                user[0].pets = pets;
                return user[0];
            } else {
                return null;
            }
        },

        async updateUserImage(userId, imagePath) {
            try {
                const sql = `
                    UPDATE users 
                    SET image = ?
                    WHERE user_id = ?
                `;
                const params = [imagePath, userId];
        
                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error updating user image:', error);
                throw error;
            }
        },
        async getUserBookings(userId, startDate, endDate) {
            const otherServicesSql = `
                SELECT 
                    p.name AS pet_name,
                    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                    s.service_name,
                    o.booking_id,
                    o.booking_date AS date,
                    'other_service' AS booking_type
                FROM other_services_bookings o
                JOIN pets p ON o.pet_id = p.pet_id
                JOIN employees e ON o.employee_id = e.employee_id
                JOIN services s ON o.service_id = s.service_id
                WHERE p.user_id = ?
                AND (o.booking_date BETWEEN ? AND ? OR o.booking_date = ? OR o.booking_date = ?)
            `;
        
           
            
            const params = [userId, startDate, endDate, startDate, endDate];
          
            
            const otherServicesBookings = await db.query(otherServicesSql, params);
            
            const bookings = [...otherServicesBookings];
            return bookings;
        }        
        
    };

    return User;
}
